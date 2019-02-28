import React, { Component } from 'react';
import './App.css';

class App extends Component {  
  
  state = {
    users: [],
    items: [],
    orders: [],
    order_items: [],
    userOrders: [],
    showing: false,
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
    this.getUsers()
      .then(res => this.setState({ users: res }))
      .catch(err => console.log(err));

    this.getItems()
      .then(res => this.setState({ items: res }))
      .catch(err => console.log(err));

    this.getOrders()
      .then(res => this.setState({ orders: res }))
      .catch(err => console.log(err));

    this.getOrder_Items()
      .then(res => this.setState({ order_items: res }))
      .catch(err => console.log(err));

    this.user_orders()
      .then(res => this.setState({ userOrders: res }))
      .catch(err => console.log(err));
  }

  getUsers = async () => {
    const response = await fetch('/api/users');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getItems = async () => {
    const response = await fetch('/api/items');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getOrders = async () => {
    const response = await fetch('/api/orders');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);    
    return body;
  };

  getOrder_Items = async () => {
    const response = await fetch('/api/order_items');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);    
    return body;
  };

  user_orders = async () => {
    const response = await fetch('/api/user_orders');
    const body = await response.json()      
    .then((userOrders) => {
      let userOrdersConvertedReturn = [];
      for (var i = 0; i < userOrders.length; i++) {
        let lastItemConvertedOrders = userOrdersConvertedReturn[userOrdersConvertedReturn.length-1];

        if (i !== 0 && this.findUserName(userOrders[i].user_id) === lastItemConvertedOrders.userID && userOrders[i].order_id === lastItemConvertedOrders.orderID) {          
          userOrdersConvertedReturn[userOrdersConvertedReturn.length-1].itemID.push(this.findItemName(userOrders[i].item_id));
        }        

        if (i === 0 || this.findUserName(userOrders[i].user_id) !== lastItemConvertedOrders.userID || userOrders[i].order_id !== lastItemConvertedOrders.orderID) {
          let userConvertedData = {
            rowid: i === 0 ? userOrders[i].rowid : lastItemConvertedOrders.rowid + 1, 
            id: userOrders[i].id, 
            userID: this.findUserName(userOrders[i].user_id), 
            orderID: userOrders[i].order_id, 
            itemID: [this.findItemName(userOrders[i].item_id)],
          }
          userOrdersConvertedReturn.push(userConvertedData);
        }
      }
      return userOrdersConvertedReturn;
    })
    .catch(err => console.log(err));

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  findUserName = (userID) => {
    let userName = userID;
    this.state.users.forEach((user) => {
      if (user.id === userID) {       
        userName = user.name;
      }
    });
    return userName;
  };

  findItemName = (itemID) => {
    let itemName = itemID;
    this.state.items.forEach((item) => {
      if (item.id === itemID) {       
        itemName = item.name;
      }
    });
    return itemName;
  };

  handleCheck = (e) => {
    // console.log(e.currentTarget.className.split(" ")[0]);
    return e.currentTarget.className.split(" ")[0];
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };


render() {
  const { showing } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="Title">
            Customer Order Management System
          </h1>
        </header>

        <div className="customers-div"> Customers
          {this.state.users.map((user) => {
            let count = 0;
            let holder = {};
            return (
              <ul key={user.id}>
                {this.state.userOrders.map((userOrder) => {
                  if (userOrder.userID === user.name) {
                    count += 1;
                    if (holder.hasOwnProperty(user.name)) {
                      holder[user.name].push(userOrder);
                    } else {
                      holder[user.name] = [userOrder];
                    }
                  }
                })}
                <div>
                  {/* <div></div> */}
                  <li className="customer-line " onClick={() => this.setState({ showing: !showing })} >
                    <div className={`${user.name} customer`} key={user.id} onClick={this.handleCheck.bind(this)}>{user.name} <span className={"count " + (count === 0 ? 'red' : 'green')}>({count})</span></div>
                      { showing ?
                        <div className="orders"> Orders
                          {holder[user.name] ? holder[user.name].map((userHolder) => {
                            if (userHolder.userID === user.name) {
                              return <div className="order" key={userHolder.rowid}>{userHolder.orderID} | {userHolder.itemID.map((item) => <span>{item}, </span>)}</div>
                            }
                            }) : <div className="noOrders">{user.name}  has not placed an order yet</div>
                          
                          }
                        </div> : null
                      }                   
                  </li>
                </div>              
              </ul>
            )
          })}
        </div>

        {/* <div> Items
          {this.state.items.map((item) => <ul key={item.id}>{item.id} | {item.name}</ul>)}
        </div> */}

        {/* <div> Orders
          {this.state.orders.map((order) => (
             <ul key={order.id}>{order.id}, 
              {this.state.users.map((user) => {
                if (user.id === order.user_id) {
                  return user.name
                }
              })}
            </ul>))
          }
        </div> */}

        {/* <div> Order Items
          {this.state.order_items.map((order_item) => {            
            return <ul key={order_item.rowid}>              
              {order_item.order_id} | 
              {this.state.items.map((item) => {
                if (item.id === order_item.item_id) {
                  return item.name;
                }
              })}
            </ul>})
          }
        </div> */}

      </div>
    );
  }  
}

export default App;
