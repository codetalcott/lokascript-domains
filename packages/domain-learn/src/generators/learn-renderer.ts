/**
 * Learn Renderer
 *
 * Renders a SemanticNode as DSL text in a target language: the commanding sentence, which is
 * `@lokascript/semantic`'s (what the product runs; hyperfixi domains rethink, decision D2). It used
 * to be learn's own frame, which wrote sentences semantic did not read (`#box .active 追加`).
 */

import type { SemanticNode } from '@lokascript/framework';
import { commandingSentence } from '../commanding';

/**
 * The commanding sentence for `node` in `language`. Throws semantic's `LossyTranslationError` where
 * semantic cannot write the command whole (the domain registry reports that as no rendering).
 */
export function renderLearn(node: SemanticNode, language: string): string {
  return commandingSentence(node, language);
}
