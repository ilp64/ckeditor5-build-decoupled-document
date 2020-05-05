import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import iconFile from './icon-video.svg';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';

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
		// const img = getViewImgFromWidget( figure );

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
		editor.model.schema.register( 'video', {
			allowIn: '$root',
			isObject: true,
			isBlock: true,
			allowAttributes: [ 'width', 'height', 'src' ]
		} );

		editor.conversion.for( 'downcast' )
			.elementToElement( {
				model: 'video',
				view: 'video'
			} )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'width' ) )
			.add( modelToViewAttributeConverter( 'height' ) );

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
					height: viewVideo.getAttribute( 'height' )
				} )
			} )
			.attributeToAttribute( {
				view: {
					name: 'video',
					key: 'src'
				},
				model: 'src'
			} )
			.attributeToAttribute( {
				view: {
					name: 'video',
					key: 'width'
				},
				model: 'width'
			} )
			.attributeToAttribute( {
				view: {
					name: 'video',
					key: 'height'
				},
				model: 'height'
			} );

		editor.ui.componentFactory.add( 'insertVideo', locale => {
			const view = new FileDialogButtonView( locale );

			// const view = new ButtonView( locale );
			view.set( {
				acceptedType: 'video/mp4',
				allowMultipleFiles: false
			} );

			view.buttonView.set( {
				label: '插入视频',
				icon: iconFile,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'done', ( evt, files ) => {
				editor.model.change( writer => {
					const video = writer.createElement( 'video', {
						// eslint-disable-next-line no-undef
						src: window.URL.createObjectURL( files[ 0 ] ),
						width: 400,
						height: 300
					} );

					const figure = writer.createElement( 'figure', { class: 'video' } );

					writer.insert( writer.createPositionAt( figure, 0 ), video );

					editor.model.insertContent( figure );
					writer.setSelection( video, 'on' );

					// const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );
					//
					// model.insertContent( imageElement, insertAtSelection );
					//
					// // Inserting an image might've failed due to schema regulations.
					// if ( imageElement.parent ) {
					// 	writer.setSelection( imageElement, 'on' );
					// }

					// const imageElement = writer.createElement( 'image', {
					// 	src: imageUrl
					// } );
					//
					// // Insert the image in the current selection location.
					// editor.model.insertContent( imageElement, editor.model.document.selection );
				} );
			} );

			return view;
		} );
	}
}
