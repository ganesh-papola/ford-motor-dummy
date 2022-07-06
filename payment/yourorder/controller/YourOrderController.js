import React, { Component } from 'react';
import ReactModal from 'react-modal';
import YourOrder from '../YourOrder';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import './YourOrderController.scss';
import { getIsDesktop } from '@Utils/Utils';

export default class YourOrderController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: 0,
      showYourOrder: false,
      scrolling: false,
      buttonPosition: 'absolute',
    };
  }

  updateScreenDimensions = () => {
    this.setState({
      screenWidth: window.innerWidth,
    });
  };

  handleScrollEvent = () => {
    const { scrolling } = this.state;
    if (!scrolling) {
      window.requestAnimationFrame(() => {
        this.setState({
          scrolling: false,
          buttonPosition: 'fixed',
        });
      });

      this.setState({
        scrolling: true,
        buttonPosition: 'absolute',
      });
    }
  };

  componentDidMount() {
    this.updateScreenDimensions();
    window.addEventListener('resize', this.updateScreenDimensions);
    window.addEventListener('scroll', this.handleScrollEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScreenDimensions);
    window.removeEventListener('scroll', this.handleScrollEvent);
  }

  toggleYourOrder = () => {
    const { showYourOrder } = this.state;
    this.setState({
      showYourOrder: !showYourOrder,
    });
  };

  makeNavigationNotVisibleWhenItShouldNotBe = () => {
    const { showYourOrder } = this.state;

    const progressContainerFromNavigation = document.getElementsByClassName(
      'steps'
    );

    if (progressContainerFromNavigation.length !== 1) {
      return;
    }

    if (showYourOrder && !getIsDesktop()) {
      progressContainerFromNavigation[0].style.zIndex = '0';
    } else {
      progressContainerFromNavigation[0].style.zIndex = '1';
    }
  };

  renderButtonOrYourOrderModal = () => {
    const reactModalOverlayStyle = {
      overlay: {
        overflowY: 'scroll',
        zIndex: 2900,
      },
    };

    const { countryCode, reviewYourOrderText } = this.props;
    const { showYourOrder } = this.state;

    if (showYourOrder) {
      return (
        <ReactModal
          isOpen={showYourOrder}
          className="your-order-modal"
          style={reactModalOverlayStyle}
          appElement={document.getElementById('main')}
        >
          <YourOrder
            handleYourOrderClose={this.toggleYourOrder}
            reviewYourOrderText={reviewYourOrderText}
            countryCode={countryCode}
            {...this.props}
          />
        </ReactModal>
      );
    } else {
      return (
        <button
          className="your-order-button"
          onClick={this.toggleYourOrder}
          style={reactModalOverlayStyle}
          aria-label={reviewYourOrderText}
        >
          <div className={`button-label ${showYourOrder ? 'hidden' : ''}`}>
            <span className="review-order">{reviewYourOrderText}</span>
            <div className="arrow-container">
              <Arrow
                className="your-order-arrow"
                orientation={ArrowOrientation.UP}
              />
            </div>
          </div>
        </button>
      );
    }
  };

  renderYourOrder() {
    const { countryCode } = this.props;

    if (!getIsDesktop()) {
      return (
        <div className="your-order-controller-container">
          {this.renderButtonOrYourOrderModal()}
        </div>
      );
    } else {
      return (
        <YourOrder
          className="desktop-your-order"
          countryCode={countryCode}
          {...this.props}
        />
      );
    }
  }

  render() {
    this.makeNavigationNotVisibleWhenItShouldNotBe();
    return this.renderYourOrder();
  }
}
