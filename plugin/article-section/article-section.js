import ArticleSectionEditing from './article-section-editing';
import ArticleSectionUI from './article-section-ui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import './style.css';

export default class ArticleSection extends Plugin {
	static get requires() {
		return [ ArticleSectionEditing, ArticleSectionUI ];
	}
}
