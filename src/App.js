import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import "./App.css";

const app = new Clarifai.App({
    apiKey: 'c69170d05cd64d4c91240af32847b925'
});

const particlesOptions = {
	particles: {
		number: {
			value: 100,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			name: 'empty'
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		// console.log(width, height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		// console.log(box);
		this.setState({box: box})
	}

	displayName = (data) => {
		let name = data.outputs[0].data.regions[0].data.concepts[0].name;
		// Capitalise first letter in each word
		name = name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
		this.setState({name: name})
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input})
		app.models
			.predict(
				Clarifai.CELEBRITY_MODEL, 
				this.state.input)
			.then(response => {
				this.displayFaceBox(this.calculateFaceLocation(response))
				this.displayName(response)
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
		    <div className="App">
		    	<Particles className='particles'
	              params={particlesOptions}
	            />
		     	<Navigation />
		     	<Logo />
		     	<Rank name={this.state.name} />
		     	<ImageLinkForm 
		     		onInputChange={this.onInputChange} 
		     		onButtonSubmit={this.onButtonSubmit}
		     	/>
		     	<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
		    </div>
	  	);
	}
}

export default App;
