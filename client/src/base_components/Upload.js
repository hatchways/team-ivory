const React = require('react');
class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.setFileUrl = props.setFileUrl;
		this.setFile = props.setFile;
	}
	handleChange(event) {
		this.setFileUrl(URL.createObjectURL(event.target.files[0]));
		this.setFile(event.target.files[0]);
	}
	render() {
		return <input type="file" onChange={this.handleChange} />;
	}
}
module.exports = Upload;
