import ArticleTitleEditing from './article-title-editing';
import ArticleTitleUI from './article-title-ui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import './style.css';

export default class ArticleTitle extends Plugin {
	static get requires() {
		return [ ArticleTitleEditing, ArticleTitleUI ];
	}
}
