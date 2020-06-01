//
//  PackageJSONTests.swift
//  KeymanEngineTests
//
//  Created by Joshua Horton on 6/1/20.
//  Copyright © 2020 SIL International. All rights reserved.
//

import XCTest
@testable import KeymanEngine

class PackageJSONTests: XCTestCase {
  private func loadObjectFromJSON<Type: Decodable>(at file: URL) throws -> Type {
    let fileContents: String = try String(contentsOf: file, encoding: .utf8).replacingOccurrences(of: "\r", with: "")
    let jsonData = fileContents.data(using: .utf8)!
    let decoder = JSONDecoder()
    return try decoder.decode(Type.self, from: jsonData)
  }

  func testLanguageDecoding() throws {
    let lang_en: KMPLanguage = try loadObjectFromJSON(at: TestUtils.PackageJSON.language_en)

    XCTAssertEqual(lang_en.name, "English")
    XCTAssertEqual(lang_en.languageId, "en")

    let lang_km: KMPLanguage = try loadObjectFromJSON(at: TestUtils.PackageJSON.language_km)

    XCTAssertEqual(lang_km.name, "Central Khmer (Khmer, Cambodia)")
    XCTAssertEqual(lang_km.languageId, "km")
  }
}
