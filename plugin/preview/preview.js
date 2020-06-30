import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import iconFile from './icon.svg';
import Command from '@ckeditor/ckeditor5-core/src/command';

class PreviewCommand extends Command {
	execute() {
		// eslint-disable-next-line no-undef
		if ( typeof window.onCkeditorPreview === 'function' ) {
			// eslint-disable-next-line no-undef
			window.onCkeditorPreview( this.editor );
		}
	}

	refresh() {
		this.isEnabled = true;
	}
}

export default class Preview extends Plugin {
	init() {
		const editor = this.editor;
		editor.commands.add( 'preview', new PreviewCommand( this.editor ) );

		// The "simpleBox" button must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add( 'preview', locale => {
			// The state of the button will be bound to the widget command.
			// const command = editor.commands.get( 'preview' );

			// The button will be an instance of ButtonView.
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				icon: iconFile,
				label: '预览',
				withText: false,
				tooltip: true,
				command: 'preview'
			} );

			// Bind the state of the button to the command.
			// buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked (executed).
			this.listenTo( buttonView, 'execute', () => editor.execute( 'preview' ) );

			return buttonView;
		} );
	}
}
