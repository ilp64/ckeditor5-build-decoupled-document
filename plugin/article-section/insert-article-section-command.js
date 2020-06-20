import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertArticleSectionCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			this.editor.model.insertContent( createArticleSection( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'articleSection' );

		this.isEnabled = allowedIn !== null;
	}
}

function createArticleSection( writer ) {
	const articleSection = writer.createElement( 'articleSection' );
	const articleSectionNo = writer.createElement( 'articleSectionNo' );
	const articleSectionTitle = writer.createElement( 'articleSectionTitle' );
	const articleSectionContent = writer.createElement( 'articleSectionContent' );

	writer.append( articleSectionNo, articleSection );
	writer.append( articleSectionTitle, articleSection );
	writer.append( articleSectionContent, articleSection );

	// There must be at least one paragraph for the description to be editable.
	// See https://github.com/ckeditor/ckeditor5/issues/1464.
	writer.appendElement( 'paragraph', articleSectionContent );

	return articleSection;
}
