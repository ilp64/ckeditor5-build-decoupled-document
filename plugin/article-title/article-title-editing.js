import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertArticleTitleCommand from './insert-article-title-command';

export default class ArticleTitleEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertArticleTitle', new InsertArticleTitleCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'articleTitle', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block'
		} );

		schema.register( 'articleTitleContent', {
			// Behaves like a self-contained object (e.g. an image).
			isLimit: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowIn: 'articleTitle',
			allowContentOf: '$block'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( /articleTitleContent/.test( context ) && childDefinition.name === 'articleTitle' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleTitle',
			view: {
				name: 'section',
				classes: 'article-title'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleTitle',
			view: {
				name: 'section',
				classes: 'article-title'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleTitle',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'article-title' } );

				return toWidget( section, viewWriter, { label: 'article title widget' } );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleTitleContent',
			view: {
				name: 'p',
				classes: 'article-title-content'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleTitleContent',
			view: {
				name: 'p',
				classes: 'article-title-content'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleTitleContent',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const p = viewWriter.createEditableElement( 'p', { class: 'article-title-content' } );
				return toWidgetEditable( p, viewWriter );
			}
		} );
	}
}
