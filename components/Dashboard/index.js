import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import BitcoinPurchaseHistory from './BitcoinPurchaseHistory';
import RipplePurchaseHistory from './RipplePurchaseHistory';
import AuditChat from './AuditChat';
import EtheriumPurchaseHistory from './EtheriumPurchaseHistory';
import LitecoinPurchaseHistory from './LitecoinPurchaseHistory';
import RevenueSummary from './RevenueSummary';
import RecentPayments from './RecentPayments';

const ResponsiveGridLayout = WidthProvider(Responsive);
export default class CryptoDashboard extends Component {
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
      { i: "a", x: 0, y: 1, w: 3, h: 1.5 },
      { i: "b", x: 3, y: 1, w: 3, h: 1.5 },
      { i: "c", x: 6, y: 1, w: 3, h: 1.5 },
      { i: "d", x: 9, y: 1, w: 3, h: 1.5 },
      { i: "e", x: 0, y: 2, w: 6, h: 2.3},
      { i: "f", x: 6, y: 2, w: 6, h: 2.3},
      { i: "g", x: 0, y: 3, w: 12,h: 2.6},
    ];
    

    var layout = { lg: this.state.value === true ? layout : layout1 };

    return (
      <div style={{paddingLeft:5,paddingRight:5}}>
        
        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 12 }}
          
          width={1200}
        >
          <div key="a">
           <BitcoinPurchaseHistory />
          </div>
          <div key="b">
           <RipplePurchaseHistory />
          </div>
          <div key="c">
            <EtheriumPurchaseHistory />
          </div>
          <div key="d">
            <LitecoinPurchaseHistory />
          </div>
          <div key="e" >
            <AuditChat />
          </div>
          <div key="f">
            <RevenueSummary />
          </div>
          <div key="g">
            <RecentPayments/>
          </div>
        </ResponsiveGridLayout>
      </div>
    );
  }
}