import { CategoryTable } from './category.js';
import { TagTable } from './tag.js';
import { PromptTable } from './prompt.js';
import { PromptTagTable } from './tag-prompt.js';

export type {
    PromptTable,
    SelectPrompt,
    InsertPrompt,
    UpdatePrompt,
} from './prompt.js';

export type {
    CategoryTable,
    SelectCategory,
    InsertCategory,
    UpdateCategory,
} from './category.js';

export type {
    TagTable,
    SelectTag,
    InsertTag,
    UpdateTag,
} from './tag.js';

export type DB = {
    prompt: PromptTable;
    tag: TagTable;
    prompt_tag: PromptTagTable;
    category: CategoryTable;
};
