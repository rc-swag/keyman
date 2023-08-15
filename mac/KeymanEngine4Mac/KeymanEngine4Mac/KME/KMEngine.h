//
//  KMEngine.h
//  KeymanEngine4Mac
//
//  Created by Serkan Kurt on 22/12/2014.
//  Copyright (c) 2017 SIL International. All rights reserved.
//

#ifndef KMEngine_h
#define KMEngine_h

#import <Foundation/Foundation.h>
#import "KMXFile.h"

//#define USE_ALERT_SHOW_HELP_TO_FORCE_EASTER_EGG_CRASH_FROM_ENGINE

@interface KMEngine : NSObject

@property (weak, nonatomic) KMXFile *kmx;
@property (assign, nonatomic) BOOL debugMode;

- (id)initWithKMX:(KMXFile *)kmx contextBuffer:(NSString *)ctxBuf;
- (void)setCoreContext:(NSString *)context;
//TODO: remove additional context methods
- (void)setContextBuffer:(NSString *)ctxBuf;
- (NSString *)contextBuffer;
- (void)setCoreOptions:(NSString *)key withValue:(NSString *)value;
- (NSArray *)processEvent:(NSEvent *)event;
- (void)setUseVerboseLogging:(BOOL)useVerboseLogging;

@end

#endif /* KMEngine_h */
