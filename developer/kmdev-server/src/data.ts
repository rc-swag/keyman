import fs = require('fs');
import { configuration } from './config';

export interface DebugObject {
  id: string;
  filename: string;
  sha256: string;
  filenameFromId(id: string): string;
};

export class DebugKeyboard implements DebugObject {
  id: string;
  filename: string;
  sha256: string;
  path: string;
  version: string;
  oskFontFace?: string;
  fontFace?: string;

  filenameFromId(id: string): string {
    return id + '.js';
  }

  toRegistrationBlob() {
    let o = {
      KN: this.id,
      KI: 'Keyboard_'+this.id,
      KL: this.id,
      KLC: 'en',
      KR: 'Europe',
      KRC: 'eu',
      KFont: this.fontFace ? { family: this.fontFace } : undefined,
      KOskFont: this.oskFontFace ? { family: this.oskFontFace } : undefined,
      KF: this.id+'.js'
    };

    return JSON.stringify(o, null, 2) + '/*'+this.sha256+'*/';
  };

/*
    '    KN:"'+name+'",'#13#10+
    '    KI:"Keyboard_'+name+'",'#13#10+
    '    KL:"'+name+'",'#13#10+
    '    KLC:"en",'#13#10+
    '    KR:"Europe",'#13#10+
    '    KRC:"eu",'#13#10+
    '    KFont:{family:"'+value.FontName[kfontChar]+'"},'#13#10+   // I4063   // I4409
    '    KOskFont:{family:"'+value.FontName[kfontOSK]+'"},'#13#10+   // I4063   // I4409
    '    KF:"'+src+'.js"'#13#10+   // I4140
*/
};

export class DebugModel implements DebugObject {
  id: string;
  filename: string;
  sha256: string;

  filenameFromId(id: string): string {
    return id + '.model.js';
  }

  toRegistrationBlob() {
    return JSON.stringify(this.id) + ', ' + JSON.stringify(this.id + '.model.js') + '/*'+this.sha256+'*/';
    //response := response + Format('registerModel("%s", "%s"); /*sha256=%s*/'#13#10, [id, model, sha]);
  }
};

export class DebugPackage implements DebugObject {
  id: string;
  filename: string;
  sha256: string;
  name: string;

  filenameFromId(id: string): string {
    return id + '.kmp';
  }
};

export class DebugFont implements DebugObject {
  id: string;
  filename: string;
  sha256: string;
  facename: string;

  filenameFromId(id: string): string {
    return id.replace(/[^a-z0-9A-Z-]/g, '_') + '.ttf';
  }
};

export class SiteData {
  keyboards: { [ id: string ]: DebugKeyboard } = {};
  models: { [ id: string ]: DebugModel } = {};
  packages: { [ id: string ]: DebugPackage } = {};
  fonts: { [ id: string ]: DebugFont } = {};

  constructor() {
    this.loadState();
  }

  private loadDebugObject(type: any, source: any, dest: any) {
    for(let id in source) {
      dest[id] = Object.assign(new type(), source[id]);
    }
  }

  private loadState() {
    const state = fs.existsSync(configuration.cacheStateFilename) ? JSON.parse(fs.readFileSync(configuration.cacheStateFilename, 'utf-8')) : null;
    this.loadDebugObject(DebugKeyboard, state?.keyboards, this.keyboards);
    this.loadDebugObject(DebugModel, state?.models, this.models);
    this.loadDebugObject(DebugFont, state?.fonts, this.fonts);
    this.loadDebugObject(DebugPackage, state?.packages, this.packages);
    // todo cleanup of missing files
  }

  public saveState() {
    fs.writeFileSync(configuration.cacheStateFilename, JSON.stringify(this, null, 2), 'utf-8');
  }
};

export let data: SiteData = new SiteData();
