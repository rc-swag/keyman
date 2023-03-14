/*
 * Keyman is copyright (C) SIL International. MIT License.
 * 
 * CoreWrapper.m
 * CoreTester
 * 
 * Created by Shawn Schantz on 2022-12-12.
 * 
 * A class to wrap an instance of a Keyman Core keyboard (a km_kbp_keyboard
 * object) and its associated objects. A new CoreWrapper is created whenever
 * Keyman for Mac switches to a new keyboard. The CoreWrapper allows Keyman
 * Engine to be mostly unaware of Keyman Core.
 */

#import "CoreWrapper.h"
#import "keyboardprocessor.h"
#import "keyboardprocessor_consts.h"

@interface CoreWrapper()

@property (readonly) km_kbp_keyboard * keyboard;
@property (readonly) km_kbp_state *keyboardState;
@property (weak, nonatomic, readonly) CoreHelper *coreHelper;

@end

@implementation CoreWrapper

-(instancetype)initWithHelper:(CoreHelper*)helper kmxFilePath:(nullable NSString*) path {
  self = [super init];
  if (self) {
    _coreHelper = helper;
    
    // if the kmxFilePath has been provided, then load the keyboard now
    if (path != nil) {
      [self changeKeyboardWithKmxFilePath: path];
    }
  }
  return self;
}

-(void)changeKeyboardWithKmxFilePath:(NSString*) path {
  if (path != nil) {
    @try {
      [self loadKeyboardUsingCore: path];
      [self readKeyboardAttributesUsingCore];
      [self createKeyboardStateUsingCore];
    }
    @catch (NSException *exception) {
      if (self.keyboardState) {
        km_kbp_state_dispose(self.keyboardState);
        _keyboardState = nil;
      }
      if (self.keyboard) {
        km_kbp_keyboard_dispose(self.keyboard);
        _keyboard = nil;
      }
      //TODO use NSError instead of NSException?
      @throw;
    }
  }
}

-(void) dealloc{
  if (self.keyboardState) {
    km_kbp_state_dispose(self.keyboardState);
  }
  if (self.keyboard) {
    km_kbp_keyboard_dispose(self.keyboard);
  }
  NSLog(@"CoreWrapper dealloc called.");
}

-(void)loadKeyboardUsingCore:(NSString*) path {
  km_kbp_path_name keyboardPath = [path UTF8String];
  km_kbp_status result = km_kbp_keyboard_load(keyboardPath, &_keyboard);
  
  if (result != KM_KBP_STATUS_OK) {
    NSString *message = [NSString stringWithFormat:@"Unexpected Keyman Core result: %u", result];
    [NSException raise:@"LoadKeyboardException" format:@"%@", message];
  }
}

-(void)readKeyboardAttributesUsingCore {
  if (self.keyboard != nil) {
    const km_kbp_keyboard_attrs * keyboardAttributes;
    km_kbp_status result = km_kbp_keyboard_get_attrs(self.keyboard, &keyboardAttributes);

    if (result==KM_KBP_STATUS_OK) {
      _keyboardVersion = [NSString stringWithCharacters:keyboardAttributes->version_string length:unistrlen(keyboardAttributes->version_string)];
      _keyboardId = [NSString stringWithCharacters:keyboardAttributes->id length:unistrlen(keyboardAttributes->id)];

      NSLog(@"keyboardVersion = %@\n, keyboardId  = %@\n", _keyboardVersion, _keyboardId);
    } else {
      NSLog(@"km_kbp_keyboard_get_attrs() failed with result = %u\n", result );
    }
  }
}

-(void)createKeyboardStateUsingCore {
  km_kbp_status result = KM_KBP_STATUS_OK;
  
  //TODO create once
  // create option list
  km_kbp_option_item coreEnvironment[6] = {0};

  if([CoreWrapper setupCoreEnvironment:coreEnvironment]) {
    // create state using keyboard and option list
    result = km_kbp_state_create(self.keyboard, coreEnvironment, &_keyboardState);

    if (result != KM_KBP_STATUS_OK) {
      NSString *message = [NSString stringWithFormat:@"Unexpected Keyman Core result: %u", result];
      [NSException raise:@"CreateKeyboardStateException" format:@"%@", message];
    }
  } else {
      NSLog(@"CoreWrapper, Unable to set environment options for keyboard" );
  }
}

-(NSArray*)processEvent:(nonnull NSEvent *)event {
  // process key down events only
  if (event.type != NSEventTypeKeyDown) {
      return nil;
  }
  // do not process command keys
  if ([event modifierFlags] & NSEventModifierFlagCommand) {
      return nil;
  }
  
  unsigned short macKeyCode = event.keyCode;
  NSEventModifierFlags modifiers = event.modifierFlags;
  //NSString *characters = [keyDownEvent characters];
  //NSString *keycap = [keyDownEvent charactersIgnoringModifiers];

  return [self processMacVirtualKey:macKeyCode
                      withModifiers:modifiers
                        withKeyDown:YES];
}

-(NSArray*)processMacVirtualKey:(unsigned short)macKeyCode
            withModifiers:(NSEventModifierFlags)modifiers
             withKeyDown:(BOOL) isKeyDown {
  NSArray *actions = nil;
  uint16_t windowsKeyCode = [self.coreHelper macVirtualKeyToWindowsVirtualKey:macKeyCode];
  uint32_t modifierState = [self.coreHelper macToKeymanModifier:modifiers];
  uint8_t keyDown = (isKeyDown) ? 1 : 0;

  if ([self processVirtualKey:windowsKeyCode
                        withModifier:modifierState
                  withKeyDown:keyDown]) {
    actions = [self loadActionsUsingCore];
  }
  return actions;
}

-(BOOL)processVirtualKey:(uint16_t)keyCode
            withModifier:(uint16_t)modifierState
             withKeyDown:(uint8_t) isKeyDown {
  
  km_kbp_status result = km_kbp_process_event(self.keyboardState, keyCode, modifierState, isKeyDown, KM_KBP_EVENT_FLAG_DEFAULT);

  if (result!=KM_KBP_STATUS_OK) {
    //TODO raise exception?
    NSLog(@"km_kbp_process_event() result = %u\n", result );
  }

  return (result==KM_KBP_STATUS_OK);
}

-(NSArray*)loadActionsForLastKeyProcessed {
  return [self loadActionsUsingCore];
}

-(NSArray*)loadActionsUsingCore {
  size_t actionCount = 0;
  km_kbp_action_item const * actionList =
      km_kbp_state_action_items(self.keyboardState, &actionCount);
  
  NSMutableArray *eventArray = [NSMutableArray arrayWithCapacity:actionCount];

  for (int i = 0; i < actionCount; i++) {
    km_kbp_action_item action = actionList[i];
    CoreAction *event = [[CoreAction alloc] initWithActionStruct:&action coreHelper:self.coreHelper];
    [eventArray insertObject:event atIndex:i];
  }
  
  return eventArray;
}

-(NSString *)getCurrentContext {
  return [self getContextAsStringUsingCore];
}

-(NSString *)getContextAsStringUsingCore {
  km_kbp_context * context =  km_kbp_state_context(self.keyboardState);;
  
  km_kbp_context_item * contextItemsArray = nil;
  size_t contextLength = km_kbp_context_length(context);
  
  NSMutableString *contextString = [[NSMutableString alloc]init];

  if (contextLength==0) {
    NSLog(@"***context is empty.");
  } else {
    km_kbp_status result = km_kbp_context_get(context, &contextItemsArray);
    if (result==KM_KBP_STATUS_OK) {
      for (int i = 0; i < contextLength; i++) {
        km_kbp_context_item contextItem = contextItemsArray[i];
        if (contextItem.type == KM_KBP_CT_CHAR) {
          const unichar unicodeChar = contextItem.character;
          NSString *charString = [NSString stringWithCharacters:&unicodeChar length:1];
          [contextString appendString:charString];
          //NSLog(@"***contextItem.character decimal: %u, hex: %X, unicode: '%@'", contextItem.character, contextItem.character, charString);
        } else {
          //NSLog(@"***contextItem = %d\n, type %hhu", i, contextItem.type);
        }
      }
    }
  }
  NSString *immutableString = [NSString stringWithString:contextString];
  
  // dispose of context items array
  if (contextItemsArray) {
    km_kbp_context_items_dispose(contextItemsArray);
  }
  
  //NSLog(@"resulting contextString=%@", immutableString);
  return immutableString;
}

//TODO create and save as static
+(BOOL)setupCoreEnvironment:(km_kbp_option_item *) coreOptionArray
    {
  //*coreOptionArray = malloc(6 * sizeof(km_kbp_option_item));

  coreOptionArray[0].scope = KM_KBP_OPT_ENVIRONMENT;
  coreOptionArray[0].key = KM_KBP_KMX_ENV_BASELAYOUT;
  //coreOptionArray[0].value = reinterpret_cast<km_kbp_cp*>(Globals::get_BaseKeyboardName());
  coreOptionArray[0].value = u"kbdus.dll";   // const char16_t*, encoded as UTF-16

  coreOptionArray[1].scope = KM_KBP_OPT_ENVIRONMENT;
  coreOptionArray[1].key = KM_KBP_KMX_ENV_BASELAYOUTALT;
  //coreOptionArray[1].value = reinterpret_cast<km_kbp_cp*>(Globals::get_BaseKeyboardNameAlt());
  coreOptionArray[1].value = u"en-US";   // const char16_t*, encoded as UTF-16

  coreOptionArray[2].scope = KM_KBP_OPT_ENVIRONMENT;
  coreOptionArray[2].key = KM_KBP_KMX_ENV_SIMULATEALTGR;
  //coreOptionArray[2].value = Globals::get_SimulateAltGr() ? u"1" : u"0";
  coreOptionArray[2].value = u"0";   // const char16_t*, encoded as UTF-16

  coreOptionArray[3].scope = KM_KBP_OPT_ENVIRONMENT;
  coreOptionArray[3].key = KM_KBP_KMX_ENV_BASELAYOUTGIVESCTRLRALTFORRALT;
  //coreOptionArray[3].value = KeyboardGivesCtrlRAltForRAlt() ? u"1" : u"0";
  coreOptionArray[3].value = u"";   // const char16_t*, encoded as UTF-16

  coreOptionArray[4].scope = KM_KBP_OPT_ENVIRONMENT;
  coreOptionArray[4].key = KM_KBP_KMX_ENV_PLATFORM;
  //coreOptionArray[4].value = WINDOWS_PLATFORM_ENV;
  coreOptionArray[4].value = u"mac macos macosx hardware desktop native";   // const char16_t*, encoded as UTF-16
  
  coreOptionArray[5] = (km_kbp_option_item) {0};
  
  return TRUE;
}

unsigned long long unistrlen(const unichar *chars)
{
    unsigned long long length = 0llu;
    if(NULL == chars) return length;

    while('\0' != chars[length])
        length++;

    return length;
}

@end
