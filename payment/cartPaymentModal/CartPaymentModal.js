import React, { forwardRef, useRef } from 'react';
import ReactModal from 'react-modal';
import FakeX from '@Common/fakeX/FakeX';
import './CartPaymentModal.global.scss';
import './CartPaymentModal.scoped.scss';
import { replaceTemplateWithComponent } from '../../cart/calculator/richTextDisclaimer/RichTextDisclaimer';
import BallChainMan from '../../cart/ballAndChainMan/BallChainMan';

const FakeXRefForwarded = forwardRef((props, ref) => (
  <FakeX {...props} forwardedRef={ref} />
));
FakeXRefForwarded.displayName = 'FakeX';

const CartPaymentModal = ({
  isModalOpen = false,
  closeModal = () => {},
  zebraList,
  headerText,
  title,
  subTitle,
  bottomContent,
  ngcBottomContent,
  showOneOffPayments,
  oneOffPaymentsHeader,
  oneOffModalTitle,
  oneOffModalSubTitle,
  oneOffBottomContent,
  showBallChainMan,
  ballChainText,
  pricingCategorySummaryOneOff,
  zebraListOneOffPayments,
}) => {
  const closer = useRef(null);

  const focusCloseBtn = () => {
    closer?.current?.focus();
  };

  return (
    <>
      <ReactModal
        isOpen={isModalOpen}
        contentLabel="Pricing Summary"
        className="cart-payment-modal"
        ariaHideApp={process.env.NODE_ENV !== 'test'}
        onRequestClose={closeModal}
        onAfterOpen={() => focusCloseBtn()}
        overlayClassName="dark-modal"
      >
        <div className="inner-wrapper">
          <header className="header">
            <span>{headerText}</span>

            <FakeXRefForwarded onTrigger={closeModal} ref={closer} />
          </header>
          <div className="body">
            <BallChainMan
              className="pricing-rail"
              showBallChainMan={showBallChainMan}
              ballChainText={ballChainText}
            />
            <h2 className="title">{title}</h2>
            <h3 className="sub-title">{subTitle}</h3>
          </div>
          {zebraList}
          <div className="bottom-content">
            {ngcBottomContent
              ? replaceTemplateWithComponent({
                  string: ngcBottomContent,
                  templateDescriptor: 'disclaimer',
                }).fullContentArray
              : bottomContent}
          </div>
          {showOneOffPayments && pricingCategorySummaryOneOff.length > 0 && (
            <>
              <div className="body">
                <h2 className="title">
                  {oneOffModalTitle || oneOffPaymentsHeader}
                </h2>
                <h3 className="sub-title">{oneOffModalSubTitle}</h3>
              </div>
              {zebraListOneOffPayments}
              <div className="bottom-content">{oneOffBottomContent}</div>
            </>
          )}
        </div>
      </ReactModal>
    </>
  );
};

export default CartPaymentModal;
