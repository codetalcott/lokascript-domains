/**
 * @lokascript/domain-sprites — Sprites DSL
 *
 * A multilingual domain-specific language for managing Fly.io Sprites, built on
 * @lokascript/framework. Parses natural language sprite commands and
 * compiles them to @fly/sprites TypeScript SDK calls.
 *
 * Supported languages: English (SVO), Spanish (SVO), Japanese (SOV), Arabic (VSO).
 *
 * @example
 * ```typescript
 * import { createSpriteDSL } from '@lokascript/domain-sprites';
 *
 * const sprites = createSpriteDSL();
 *
 * // Parse (English)
 * const node = sprites.parse('create sprite my-env', 'en');
 * // → { action: 'create', roles: Map { 'name' → 'my-env' } }
 *
 * // Compile (English)
 * const result = sprites.compile('run "npm test" on ci', 'en');
 * // → { ok: true, code: 'await client.sprite("ci").exec("npm test");' }
 *
 * // Parse (Spanish)
 * sprites.parse('crear mi-env', 'es');
 *
 * // Parse (Japanese — SOV word order)
 * sprites.parse('mi-env を 作成', 'ja');
 *
 * // Parse (Arabic — VSO word order)
 * sprites.parse('أنشئ mi-env', 'ar');
 *
 * // Translate between languages
 * sprites.translate('create my-env', 'en', 'es');
 * // → 'crear my-env'
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import { allSchemas } from './schemas';
import { englishProfile } from './profiles/english';
import { spanishProfile } from './profiles/spanish';
import { japaneseProfile } from './profiles/japanese';
import { arabicProfile } from './profiles/arabic';
import { EnglishSpriteTokenizer } from './tokenizers/english';
import { SpanishSpriteTokenizer } from './tokenizers/spanish';
import { JapaneseSpriteTokenizer } from './tokenizers/japanese';
import { ArabicSpriteTokenizer } from './tokenizers/arabic';
import { englishGrammar } from './profiles/grammar/english';
import { spanishGrammar } from './profiles/grammar/spanish';
import { japaneseGrammar } from './profiles/grammar/japanese';
import { arabicGrammar } from './profiles/grammar/arabic';
import { spritesCodeGenerator } from './generators/sprites-generator';

/**
 * Create a Sprites DSL instance with all supported languages.
 */
export function createSpriteDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'Sprites',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishSpriteTokenizer,
        patternProfile: englishProfile,
        grammarProfile: englishGrammar,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishSpriteTokenizer,
        patternProfile: spanishProfile,
        grammarProfile: spanishGrammar,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseSpriteTokenizer,
        patternProfile: japaneseProfile,
        grammarProfile: japaneseGrammar,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicSpriteTokenizer,
        patternProfile: arabicProfile,
        grammarProfile: arabicGrammar,
      },
    ],
    codeGenerator: spritesCodeGenerator,
  });
}

// Re-export for consumers who want to extend
export { allSchemas } from './schemas';
export {
  createSchema,
  destroySchema,
  listSchema,
  runSchema,
  checkpointSchema,
  restoreSchema,
  serveSchema,
  proxySchema,
  allowSchema,
  denySchema,
} from './schemas';

// Profiles
export { englishProfile } from './profiles/english';
export { spanishProfile } from './profiles/spanish';
export { japaneseProfile } from './profiles/japanese';
export { arabicProfile } from './profiles/arabic';

// Grammar profiles
export { englishGrammar } from './profiles/grammar/english';
export { spanishGrammar } from './profiles/grammar/spanish';
export { japaneseGrammar } from './profiles/grammar/japanese';
export { arabicGrammar } from './profiles/grammar/arabic';

// Tokenizers
export { EnglishSpriteTokenizer } from './tokenizers/english';
export { SpanishSpriteTokenizer } from './tokenizers/spanish';
export { JapaneseSpriteTokenizer } from './tokenizers/japanese';
export { ArabicSpriteTokenizer } from './tokenizers/arabic';

// Generator
export { spritesCodeGenerator } from './generators/sprites-generator';

// Client & executor
export { SpritesClient } from './client';
export { SpriteExecutor } from './executor';
export type {
  SpritesClientConfig,
  Sprite,
  SpriteListResponse,
  ExecResult,
  Checkpoint,
  Service,
  NetworkPolicy,
  ExecutionResult,
} from './types';
export { SpritesApiError } from './types';
