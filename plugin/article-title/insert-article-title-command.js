import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertArticleTitleCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			this.editor.model.insertContent( createArticleTitle( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'articleTitle' );

		this.isEnabled = allowedIn !== null;
	}
}

function createArticleTitle( writer ) {
	const articleTitle = writer.createElement( 'articleTitle' );
	const articleTitleContent = writer.createElement( 'articleTitleContent' );
	writer.append( articleTitleContent, articleTitle );

	// // There must be at least one paragraph for the description to be editable.
	// // See https://github.com/ckeditor/ckeditor5/issues/1464.
	return articleTitle;
}
