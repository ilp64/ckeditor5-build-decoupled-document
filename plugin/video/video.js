import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import iconFile from './icon.svg';
// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import './style.css';

function getSize( url ) {
	return new Promise( resolve => {
		// eslint-disable-next-line no-undef
		const video = document.createElement( 'video' );
		video.preload = 'metadata';
		video.addEventListener( 'loadedmetadata', () => {
			resolve( {
				height: video.videoHeight,
				width: video.videoWidth
			} );
		}, false );
		video.src = url;
	} );
}

function modelToViewAttributeConverter( attributeKey ) {
	return dispatcher => {
		dispatcher.on( `attribute:${ attributeKey }:video`, converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const video = conversionApi.mapper.toViewElement( data.item );

		if ( data.attributeNewValue !== null ) {
			viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, video );
		} else {
			viewWriter.removeAttribute( data.attributeKey, video );
		}
	}
}

export default class InsertVideo extends Plugin {
	init() {
		const editor = this.editor;
		// CKEditorInspector.attach( editor );
		editor.model.schema.register( 'video', {
			allowIn: '$root',
			isObject: true,
			isBlock: true,
			allowAttributes: [ 'width', 'height', 'src', 'class', 'controls' ]
		} );

		editor.conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'video',
				view: ( modelElement, viewWriter ) => {
					const video = viewWriter.createContainerElement( 'video' );
					return toWidget( video, viewWriter );
				}
			} )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'width' ) )
			.add( modelToViewAttributeConverter( 'height' ) )
			.add( modelToViewAttributeConverter( 'class' ) )
			.add( modelToViewAttributeConverter( 'controls' ) );

		editor.conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'video',
				view: 'video'
			} )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'width' ) )
			.add( modelToViewAttributeConverter( 'height' ) )
			.add( modelToViewAttributeConverter( 'controls' ) )
			.add( modelToViewAttributeConverter( 'class' ) );

		editor.conversion.for( 'upcast' )
			.elementToElement( {
				view: {
					name: 'video',
					attributes: {
						src: true,
						width: true,
						height: true
					}
				},
				model: ( viewVideo, modelWriter ) => modelWriter.createElement( 'video', {
					src: viewVideo.getAttribute( 'src' ),
					width: viewVideo.getAttribute( 'width' ),
					height: viewVideo.getAttribute( 'height' ),
					controls: true
				} )
			} );

		editor.ui.componentFactory.add( 'insertVideo', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: '插入视频',
				icon: iconFile,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				// eslint-disable-next-line
				const url = window.prompt( '视频链接' );
				editor.model.change( writer => {
					getSize( url )
						.then( size => {
							const video = writer.createElement( 'video', {
								src: url,
								width: size.width,
								height: size.height,
								controls: true
							} );
							editor.model.insertContent( video, editor.model.document.selection );
						} );
				} );
			} );

			return view;
		} );
	}
}
