import React, { Component } from "react";
// import GridLayout from 'react-grid-layout';
// import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
export default class Dragandrop extends Component {
  constructor() {
    super();
    this.state = {
      value: true,
    };
    this.onHandle = this.onHandle.bind(this);
  }
  onHandle() {
    this.setState((prevState) => ({
      value: !prevState.value,
    }));
  }
  render() {
    var layout = [
      { i: "a", x: 0, y: 0, w: 3, h: 1 },
      { i: "b", x: 3, y: 0, w: 3, h: 1 },
      { i: "c", x: 6, y: 0, w: 3, h: 1 },
      { i: "d", x: 9, y: 0, w: 3, h: 1 },
    ];
    

    var layout = { lg: this.state.value === true ? layout : layout1 };

    return (
      <div>
        
        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 12 }}
          rowHeight={281}
          width={1200}
        >
          <div key="a" style={{ backgroundColor: "yellow" }}>
            
          </div>
          <div key="b" style={{ backgroundColor: "green" }}>
            
          </div>
          <div key="c" style={{ backgroundColor: "red" }}>
            
          </div>
          <div key="d" style={{ backgroundColor: "blue" }}>
           
          </div>
          
        </ResponsiveGridLayout>
      </div>
    );
  }
}
