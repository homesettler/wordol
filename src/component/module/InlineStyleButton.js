import React from 'react';
import { Button,Icon } from 'antd';

class InlineStyleButton extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            buttonType:'default',
            styleType:'BOLD',
        };
        this.onClick = this.onClick.bind(this);
        this.state.styleType = props.styleType;
    }
    onClick(){
        // if(this.state.buttonType === 'default')
        //     this.setState({
        //         buttonType:'primary'
        //     });
        // else
        //     this.setState({
        //         buttonType:'default'
        //     });
        this.props.onClick();
    }
    render() {
        return(
            <Button type={this.state.buttonType}
                    onClick={this.onClick}
                    style = {{width:'90%', height:'38px'}}
            >
                <Icon type={this.props.styleType}/>
            </Button>
        );
    };
}

export default InlineStyleButton;
