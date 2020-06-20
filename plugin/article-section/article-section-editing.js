import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertArticleSectionCommand from './insert-article-section-command';

export default class ArticleSectionEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertArticleSection', new InsertArticleSectionCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'articleSection', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block'
		} );

		schema.register( 'articleSectionNo', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'articleSection',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'articleSectionTitle', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'articleSection',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'articleSectionContent', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'articleSection',

			// Allow content which is allowed in the root (e.g. paragraphs).
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( /articleSectionNo|articleSectionTitle|articleSectionContent/.test( context ) &&
				childDefinition.name === 'articleSection' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleSection',
			view: {
				name: 'section',
				classes: 'article-section'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleSection',
			view: {
				name: 'section',
				classes: 'article-section'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleSection',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'article-section' } );

				return toWidget( section, viewWriter, { label: 'article section widget' } );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleSectionNo',
			view: {
				name: 'p',
				classes: 'article-section-no'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleSectionNo',
			view: {
				name: 'p',
				classes: 'article-section-no'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleSectionNo',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const p = viewWriter.createEditableElement( 'p', { class: 'article-section-no' } );
				return toWidgetEditable( p, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleSectionTitle',
			view: {
				name: 'p',
				classes: 'article-section-title'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleSectionTitle',
			view: {
				name: 'p',
				classes: 'article-section-title'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleSectionTitle',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const p = viewWriter.createEditableElement( 'p', { class: 'article-section-title' } );
				return toWidgetEditable( p, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'articleSectionContent',
			view: {
				name: 'div',
				classes: 'article-section-content'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'articleSectionContent',
			view: {
				name: 'div',
				classes: 'article-section-content'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'articleSectionContent',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement( 'div', { class: 'article-section-content' } );

				return toWidgetEditable( div, viewWriter );
			}
		} );
	}
}
