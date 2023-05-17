import React from 'react';
import "./buttons_bar.css";

class buttons_bar extends React.Component {

    constructor(props){
        super(props);
          
        

    }
    showAppliedStudents = () =>{
      
      this.props.navigate(`/universitydash/${this.props.name}/AppliedStudents`);
    }

    addProgram = () => {
      this.props.onAddProgram();
    }

    render(){
        return (
            <div className="buttons_bar" id="">

            <button className="button_bar_btns" onClick={this.showAppliedStudents} >View Applied Students</button>

            <button className="button_bar_btns" onClick={this.addProgram}>Add A Program</button>

          </div>

        )
    }
}

export default buttons_bar;
