import { Button, Icon } from "semantic-ui-react";
import { ProductType } from "../../dataLayer/api";

type Props = {
  product: ProductType;
  onConnect?: (product: ProductType) => void;
  onDisconnect?: (product: ProductType) => void;
  connecting?: boolean;
  connected?: boolean;
}

export function Product({ product, onConnect, onDisconnect, connecting, connected }: Props) {
  return (
    <div>
      <div>
        <h3>{product.name}</h3>
      </div>

      <div>
        <h4>{product.price}</h4>
      </div>
      {connected ?
        <Button
          disabled={connecting}
          secondary
          onClick={() => onDisconnect?.(product)}
        >
          Remove from Cart {connecting && <Icon loading name="spinner" />}
        </Button>
        :
        <Button
          disabled={connecting}
          primary
          onClick={() => onConnect?.(product)}
        >
          Add to Cart {connecting && <Icon loading name="spinner" />}
        </Button>
      }

    </div>
  )
}