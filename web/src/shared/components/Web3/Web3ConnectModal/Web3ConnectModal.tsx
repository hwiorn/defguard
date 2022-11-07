import './style.scss';
import './style.scss';

import { ReactNode, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

import { useModalStore } from '../../../hooks/store/useModalStore';
import { toaster } from '../../../utils/toaster';
import Button, { ButtonSize } from '../../layout/Button/Button';
import { ModalWithTitle } from '../../layout/ModalWithTitle/ModalWithTitle';
import { RowBox } from '../../layout/RowBox/RowBox';
import { MetamaskIcon, WalletconnectIcon } from '../../svg';

const getConnectorIcon = (name: string): ReactNode => {
  switch (name) {
    case 'WalletConnect':
      return <WalletconnectIcon />;
    case 'MetaMask':
      return <MetamaskIcon />;
    default:
      return <></>;
  }
};

export const Web3ConnectModal = () => {
  const modalState = useModalStore((state) => state.connectWalletModal);
  const setModalsState = useModalStore((state) => state.setState);
  return (
    <ModalWithTitle
      backdrop
      id="connect-wallet"
      title="Connect your wallet"
      isOpen={modalState.visible}
      setIsOpen={(visibility) =>
        setModalsState({ connectWalletModal: { visible: visibility } })
      }
    >
      <WalletConnectorsList />
      <div className="controls">
        <Button
          text="cancel"
          className="cancel"
          size={ButtonSize.BIG}
          onClick={() =>
            setModalsState({ connectWalletModal: { visible: false } })
          }
        />
      </div>
    </ModalWithTitle>
  );
};

const WalletConnectorsList = () => {
  const { isConnected } = useAccount();
  const setModalsStore = useModalStore((state) => state.setState);
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  useEffect(() => {
    if (error && error.message) {
      toaster.error(error.message);
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isConnected) {
      setModalsStore({ connectWalletModal: { visible: false } });
      toaster.success('Wallet connected.');
    }
  }, [isConnected, setModalsStore]);

  return (
    <div className="connectors">
      {connectors.map((connector) => (
        <RowBox
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={
            isLoading ||
            connector.id === pendingConnector?.id ||
            !connector.ready
          }
        >
          {getConnectorIcon(connector.name)}
          <p>{connector.name}</p>
        </RowBox>
      ))}
    </div>
  );
};