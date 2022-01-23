import { Button, Icon } from "semantic-ui-react";
import { CompanyType } from "../../dataLayer/api";

type Props = {
  company: CompanyType;
  onConnect: (company: CompanyType) => void;
  onDisconnect: (company: CompanyType) => void;

  connecting?: boolean;
  connected?: boolean;
}

export function Company({ company, onConnect, onDisconnect, connecting, connected }: Props) {
  return (
    <div>
      <div>
        <h3>{company.name}</h3>
      </div>

      <div>
        <p>{company.description}</p>
      </div>
      {connected ?
        <Button
          disabled={connecting}
          secondary
          onClick={() => onDisconnect?.(company)}
        >
          Disconnect {connecting && <Icon loading name="spinner" />}
        </Button>
        :
        <Button
          disabled={connecting}
          primary
          onClick={() => onConnect(company)}
        >
          Connect {connecting && <Icon loading name="spinner" />}
        </Button>
      }

    </div>
  )
}