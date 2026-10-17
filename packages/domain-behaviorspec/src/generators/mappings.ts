/**
 * Declarative Playwright Code Mappings
 *
 * Maps BehaviorSpec keywords (multilingual) to Playwright code templates.
 * Templates use ${target}, ${value}, ${width}, ${height}, ${ms} placeholders.
 *
 * Languages: EN, ES, JA, AR, KO, ZH, FR, TR
 */

// =============================================================================
// Types
// =============================================================================

export interface SetupMapping {
  /** Subject keywords that trigger this mapping (all languages) */
  keywords: string[];
  /** Playwright setup template. Use ${value} placeholder. */
  template: string;
  /** Special handler type */
  type?: 'goto' | 'viewport';
}

export interface InteractionMapping {
  /** Action keywords that trigger this mapping (all languages) */
  keywords: string[];
  /** Playwright action template. Use ${target} and ${value} placeholders. */
  template: string;
}

export interface AssertionMapping {
  /** Assertion keywords that trigger this mapping (all languages) */
  keywords: string[];
  /** Playwright assertion template. Use ${target} and ${value} placeholders. */
  template: string;
  /** Negation template (with .not). If not provided, auto-generated. */
  negationTemplate?: string;
}

// =============================================================================
// GIVEN Setup Mappings
// =============================================================================

export const SETUP_MAPPINGS: SetupMapping[] = [
  {
    keywords: ['page', 'pagina', 'ページ', 'صفحة', '페이지', '页面', 'page', 'sayfa'],
    template: "  await page.goto('${value}');",
    type: 'goto',
  },
  {
    keywords: ['viewport', 'pantalla', '画面', 'شاشة', '화면', '视口', 'ecran', 'ekran'],
    template: '  await page.setViewportSize({ width: ${width}, height: ${height} });',
    type: 'viewport',
  },
];

// =============================================================================
// WHEN Interaction Mappings
// =============================================================================

export const INTERACTION_MAPPINGS: InteractionMapping[] = [
  {
    keywords: ['clicks', 'click', 'clic', 'クリック', 'نقر', '클릭', '点击', 'cliquer', 'tikla'],
    template: "  await page.locator('${target}').click();",
  },
  {
    keywords: ['types', 'type', 'escribe', '入力', 'كتابة', '입력', '输入', 'saisir', 'yaz'],
    template: "  await page.locator('${target}').fill('${value}');",
  },
  {
    keywords: [
      'submits',
      'submit',
      'envia',
      '送信',
      'إرسال',
      '제출',
      '提交',
      'soumettre',
      'gonder',
    ],
    template: "  await page.locator('${target}').press('Enter');",
  },
  {
    keywords: [
      'hovers',
      'hover',
      'sobrevolar',
      'ホバー',
      'تحويم',
      '호버',
      '悬停',
      'survoler',
      'gezin',
    ],
    template: "  await page.locator('${target}').hover();",
  },
  {
    keywords: [
      'scrolls',
      'scroll',
      'desplaza',
      'スクロール',
      'تمرير',
      '스크롤',
      '滚动',
      'defiler',
      'kaydir',
    ],
    template: "  await page.locator('${target}').scrollIntoViewIfNeeded();",
  },
  {
    keywords: [
      'drags',
      'drag',
      'arrastra',
      'ドラッグ',
      'سحب',
      '드래그',
      '拖动',
      'glisser',
      'surukle',
    ],
    template: "  await page.locator('${target}').dragTo(page.locator('${value}'));",
  },
  {
    keywords: [
      'double-clicks',
      'doble-clic',
      'ダブルクリック',
      'نقر-مزدوج',
      '더블클릭',
      '双击',
      'double-clic',
      'cift-tikla',
    ],
    template: "  await page.locator('${target}').dblclick();",
  },
  {
    keywords: [
      'right-clicks',
      'clic-derecho',
      '右クリック',
      'نقر-يمين',
      '우클릭',
      '右击',
      'clic-droit',
      'sag-tikla',
    ],
    template: "  await page.locator('${target}').click({ button: 'right' });",
  },
  {
    keywords: [
      'focuses',
      'focus',
      'enfoca',
      'フォーカス',
      'تركيز',
      '포커스',
      '聚焦',
      'focaliser',
      'odaklan',
    ],
    template: "  await page.locator('${target}').focus();",
  },
  {
    keywords: [
      'clears',
      'clear',
      'limpia',
      'クリア',
      'مسح',
      '지우기',
      '清除',
      'effacer',
      'temizle',
    ],
    template: "  await page.locator('${target}').clear();",
  },
  // From domain-bdd (merged into behaviorspec, hyperfixi domains rethink Phase 5): its words, with
  // English's -s form, Spanish's third person, and the Turkish and French spellings without marks
// (not where that spelling is an English word: `active`, `charge`).
  {
    keywords: [
      'presses',
      'press',
      'presiona',
      'presionar',
      'キー',
      'ضغط',
      '키',
      '按',
      'appuyer',
      'bas',
    ],
    template: "  await page.keyboard.press('${value}');",
  },
  {
    keywords: [
      'checks',
      'check',
      'marca',
      'marcar',
      'チェック',
      'تحديد',
      '체크',
      '勾选',
      'cocher',
      'işaretle',
      'isaretle',
    ],
    template: "  await page.locator('${target}').check();",
  },
  {
    keywords: [
      'unchecks',
      'uncheck',
      'desmarca',
      'desmarcar',
      'チェック解除',
      'إلغاء-تحديد',
      '체크해제',
      '取消勾选',
      'décocher',
      'decocher',
      'işareti-kaldır',
      'isareti-kaldir',
    ],
    template: "  await page.locator('${target}').uncheck();",
  },
  {
    keywords: [
      'selects',
      'select',
      'selecciona',
      'seleccionar',
      '選択',
      'اختيار',
      '선택',
      '选择',
      'sélectionner',
      'selectionner',
      'seç',
      'sec',
    ],
    template: "  await page.locator('${target}').selectOption('${value}');",
  },
  {
    // bdd's es, fr and tr words (`esperar`, `attendre`, `bekle`) are behaviorspec's `expect`.
    keywords: ['waits', 'wait', '待機', 'انتظار', '대기', '等待'],
    template: "  await page.locator('${target}').waitFor();",
  },
];

// =============================================================================
// GIVEN Element States (from domain-bdd)
// =============================================================================

/**
 * `given #button is visible`: a precondition on an element's state, checked before the test goes on.
 * `given`'s value is free text, so a state is its whole value, with a copula (`STATE_COPULAS`) before
 * or after it dropped.
 */
export const STATE_MAPPINGS: InteractionMapping[] = [
  {
    keywords: ['exists', 'existe', '存在', 'موجود', '존재', 'mevcut'],
    template: "  await expect(page.locator('${target}')).toBeAttached();",
  },
  {
    keywords: ['visible', '表示', 'ظاهر', '표시', '可见', 'görünür', 'gorunur'],
    template: "  await expect(page.locator('${target}')).toBeVisible();",
  },
  {
    keywords: ['hidden', 'oculto', '非表示', 'مخفي', '숨김', '隐藏', 'gizli', 'caché', 'cache'],
    template: "  await expect(page.locator('${target}')).toBeHidden();",
  },
  {
    keywords: ['loaded', 'cargado', '読込', 'محمل', '로드됨', '加载', 'yüklü', 'yuklu', 'chargé'],
    template: "  await page.waitForLoadState('domcontentloaded');",
  },
  {
    keywords: [
      'disabled',
      'deshabilitado',
      '無効',
      'معطل',
      '비활성',
      '禁用',
      'devre dışı',
      'devre disi',
      'désactivé',
      'desactive',
    ],
    template: "  await expect(page.locator('${target}')).toBeDisabled();",
  },
  {
    keywords: ['enabled', 'habilitado', '有効', 'مفعل', '활성', '启用', 'etkin', 'activé'],
    template: "  await expect(page.locator('${target}')).toBeEnabled();",
  },
  {
    keywords: [
      'checked',
      'marcado',
      'チェック済み',
      'محدد',
      '체크됨',
      '选中',
      'işaretli',
      'isaretli',
      'coché',
      'coche',
    ],
    template: "  await expect(page.locator('${target}')).toBeChecked();",
  },
  {
    keywords: [
      'focused',
      'enfocado',
      'フォーカス',
      'مركز',
      '포커스',
      '聚焦',
      'odaklanmış',
      'odaklanmis',
      'focalisé',
      'focalise',
    ],
    template: "  await expect(page.locator('${target}')).toBeFocused();",
  },
];

/** A copula before or after a state, dropped (`is visible`, `es visible`, `görünür dir`). */
export const STATE_COPULAS = ['is', 'es', 'está', 'esta', 'est', 'هو', '是', 'dir'];

// =============================================================================
// EXPECT Assertion Mappings
// =============================================================================

export const ASSERTION_MAPPINGS: AssertionMapping[] = [
  {
    keywords: [
      'appears',
      'visible',
      'aparece',
      '表示',
      'يظهر',
      '보임',
      '可见',
      'visible',
      'gorunur',
    ],
    template: "  await expect(page.locator('${target}')).toBeVisible();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeVisible();",
  },
  {
    keywords: [
      'disappears',
      'hidden',
      'desaparece',
      '非表示',
      'يختفي',
      '숨김',
      '隐藏',
      'cache',
      'gizli',
    ],
    template: "  await expect(page.locator('${target}')).toBeHidden();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeHidden();",
  },
  {
    keywords: ['has', 'tiene', '持つ', 'يحتوي', '가짐', '有', 'a', 'var'],
    template: "  await expect(page.locator('${target}')).toHaveClass(/${value}/);",
    negationTemplate: "  await expect(page.locator('${target}')).not.toHaveClass(/${value}/);",
  },
  {
    keywords: [
      'shows',
      'muestra',
      '表示する',
      'يعرض',
      '보여줌',
      '显示',
      'affiche',
      'gosterir',
      'saying',
      'diciendo',
    ],
    template: "  await expect(page.locator('${target}')).toContainText('${value}');",
    negationTemplate: "  await expect(page.locator('${target}')).not.toContainText('${value}');",
  },
  {
    keywords: ['changes', 'cambia', '変わる', 'يتغير', '변경', '变化', 'change', 'degisir'],
    template: "  await expect(page.locator('${target}')).toHaveText('${value}');",
  },
  {
    // From domain-bdd: `expect #title text saying Welcome`.
    keywords: ['text', 'texto', 'テキスト', 'نص', '텍스트', '文本', 'texte', 'metin'],
    template: "  await expect(page.locator('${target}')).toHaveText('${value}');",
    negationTemplate: "  await expect(page.locator('${target}')).not.toHaveText('${value}');",
  },
  {
    keywords: ['contains', 'contiene', '含む', 'يحتوي-على', '포함', '包含', 'contient', 'icerir'],
    template: "  await expect(page.locator('${target}')).toContainText('${value}');",
  },
  {
    keywords: ['enabled', 'habilitado', '有効', 'مفعل', '활성', '启用', 'actif', 'aktif'],
    template: "  await expect(page.locator('${target}')).toBeEnabled();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeEnabled();",
  },
  {
    keywords: ['disabled', 'deshabilitado', '無効', 'معطل', '비활성', '禁用', 'inactif', 'pasif'],
    template: "  await expect(page.locator('${target}')).toBeDisabled();",
  },
  // New assertion types (Phase 4)
  {
    keywords: [
      'checked',
      'marcado',
      'チェック済み',
      'محدد',
      '체크됨',
      '已选中',
      'coche',
      'isaretli',
    ],
    template: "  await expect(page.locator('${target}')).toBeChecked();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeChecked();",
  },
  {
    keywords: [
      'focused',
      'enfocado',
      'フォーカス中',
      'مركز',
      '포커스됨',
      '聚焦中',
      'focalise',
      'odakli',
    ],
    template: "  await expect(page.locator('${target}')).toBeFocused();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeFocused();",
  },
  {
    keywords: [
      'editable',
      'editable',
      '編集可能',
      'قابل-للتعديل',
      '편집가능',
      '可编辑',
      'modifiable',
      'duzenlenebilir',
    ],
    template: "  await expect(page.locator('${target}')).toBeEditable();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeEditable();",
  },
  {
    keywords: ['empty', 'vacio', '空', 'فارغ', '비어있음', '为空', 'vide', 'bos'],
    template: "  await expect(page.locator('${target}')).toBeEmpty();",
    negationTemplate: "  await expect(page.locator('${target}')).not.toBeEmpty();",
  },
  {
    keywords: ['count', 'cantidad', '数', 'عدد', '개수', '数量', 'nombre', 'sayi'],
    template: "  await expect(page.locator('${target}')).toHaveCount(${value});",
  },
  {
    keywords: ['value', 'valor', '値', 'قيمة', '값', '值', 'valeur', 'deger'],
    template: "  await expect(page.locator('${target}')).toHaveValue('${value}');",
    negationTemplate: "  await expect(page.locator('${target}')).not.toHaveValue('${value}');",
  },
];
