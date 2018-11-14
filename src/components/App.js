import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      clubName: "",
      mFile: "",
      fFile: null,
      out: null,
      step: 0
    }
    this.fileUpload = this.fileUpload.bind(this);
    this.textInput = this.textInput.bind(this);
    this.getForm = this.getForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getLoading = this.getLoading.bind(this);
    this.getOutput = this.getOutput.bind(this);
  }
  fileUpload(e){
    if(e.target.files[0].type!=="application/zip"){
      alert("please upload only zip files of the images");
      e.target.value = "";
    }else{
      this.setState({[e.target.name]: e.target.files[0]});
    }
  }
  textInput(e){
    this.setState({[e.target.name]: e.target.value});
  }
  onSubmit(e){
    alert("yay!");
    e.preventDefault();
    this.setState({step:(this.state.step+1)%3});
  }
  getForm(){
    return (
      <div className="App">
      <form>
        Club Name: <input type="text" value= {this.state.clubName} name="clubName" onChange={this.textInput}/>
        <br/>
        <br/>
        Male zip file: <input type="file" name="mFile" onChange={this.fileUpload}/>
        <br/>
        <br/>
        Female zip file: <input type="file" name="fFile" onChange={this.fileUpload}/>
        <br/>
        <br/>
        <input type="submit" value="Process" onClick={this.onSubmit}/>
      </form>
      </div>
    );
  }
  getLoading(){
    return (
      <div>
        Loading
        
      </div>
    )
  }
  getOutput(){
    return (
      <div>
        Output
      </div>
    )
  }
  render() {
    if(this.state.step===0)
      return this.getForm();
    else if(this.state.step===1)
      return this.getLoading()
    else
      return this.getOutput()
  }
}

export default App;
