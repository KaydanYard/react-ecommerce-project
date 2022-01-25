import { Button, Icon } from "semantic-ui-react";
import { StoreItemType } from "../../dataLayer/api";

type Props = {
  item: StoreItemType;
  onConnect: (item: StoreItemType) => void;
  onDisconnect: (item: StoreItemType) => void;
  connecting?: boolean;
  connected?: boolean;
}

export function StoreItem({ item, onConnect, onDisconnect, connecting, connected }: Props) {
  return (
    <div>
      <div>
        <h3>{item.name}</h3>
      </div>

      <div>
        <p>{item.description}</p>
      </div>
      {connected ?
        <Button
          disabled={connecting}
          secondary
          onClick={() => onDisconnect?.(item)}
        >
          Remove from Cart {connecting && <Icon loading name="spinner" />}
        </Button>
        :
        <Button
          disabled={connecting}
          primary
          onClick={() => onConnect(item)}
        >
          Add to Cart {connecting && <Icon loading name="spinner" />}
        </Button>
      }

    </div>
  )
}