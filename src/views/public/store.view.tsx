import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { Grid, Menu, Input, Modal, Button, Icon } from "semantic-ui-react";
import { StoreItem } from "../../components/store"
import API, { StoreItemType } from "../../dataLayer/api"
import { useGlobalContext } from "../../contexts/global.context";

type ParamType = { id?: string }

type LoadersState = {
  connecting?: boolean;
  disconnecting?: boolean;
  fetching?: boolean;
}

export function StoresView() {
  const { id } = useParams<ParamType>()
  const { state: { loggedIn, user } } = useGlobalContext();
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string | undefined>()
  const [loaders, setLoaders] = useState<LoadersState>({})
  const navigate = useNavigate()

  const { data: Stores } = useQuery(["Stores"], async () => {
    const { data, status } = await API.getStore()
    return data
  })

  const { data: connectedStores, refetch: refetchConnectedStores } = useQuery(["connectedStores", user?.username], async () => {
    if (!user?.username) {
      return Promise.resolve([])
    }
    const { data, status } = await API.getConnectedStore(user?.username)
    return data || []
  })

  // Search Handler
  const handleSearch = ({ target: { value } }: any) => {
    setSearch(value);
  }

  // Stores
  const filteredStores = useMemo(() => {
    if (!search) {
      return Stores;
    }
    const searchLowered = search?.toLowerCase();
    return Stores?.filter((store) => JSON.stringify(Object.values(store)).toLowerCase().includes(searchLowered))
  }, [search, Stores])

  const store = useMemo(() => {
    return Stores?.find((store) => String(store.id) === id)
  }, [id, Stores])

  // store Selector
  const handleSelectStore = (storeId: number) => () => {
    navigate(`/Stores/${storeId}`)
  }

  // Connect Handler
  const handleConnect = async (store: StoreItemType) => {
    if (!loggedIn) {
      setModalOpen(true)
    } else if (user?.username) {
      setLoaders({ connecting: true })
      await API.connectToStore(user?.username, store.id);
      setLoaders({ fetching: true })
      await refetchConnectedStores()
      setLoaders({})
    }

  }

  const handleDisconnect = async (store: StoreItemType) => {
    setLoaders({ connecting: true })
    await API.disconnectFromStore(user?.username, store.id);
  }

  const closeModal = () => setModalOpen(false)

  const handleNavigate = (to: string) => () => {
    navigate(to)
  }

  return (
    <div>
      <Grid>
        <Grid.Column width={4}>
          <Input size="small" onChange={handleSearch} />

          <Menu vertical style={{ opacity: loaders.fetching ? '0.4' : '1' }}>
            {filteredStores?.map((store) => (
              <Menu.Item
                active={String(store.id) === id}
                key={store.id}
                onClick={handleSelectStore(store.id)}
              >
                {connectedStores?.includes(store.id) && <Icon name="star" />} {store.name}
              </Menu.Item>)
            )}
          </Menu>
        </Grid.Column>

        <Grid.Column width={12}>
          {store ? (
            <StoreItem
              item={store}
              connected={connectedStores?.includes(store.id)}
              onConnect={handleConnect}
              connecting={loaders.connecting}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <h2>Please Select a store</h2>
          )}
        </Grid.Column>
      </Grid>
      <Modal open={modalOpen} onClose={closeModal}>
        <Modal.Header>
          You Must Be Logged In
        </Modal.Header>
        <Modal.Content>
          Please Log In or Sign Up to Connect to a store
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleNavigate(`/sign-up?redirect=/Stores/${id}`)}>Sign Up</Button>
          <Button primary onClick={handleNavigate(`/login?redirect=/Stores/${id}`)}>Log In</Button>
          <Button secondary onClick={closeModal}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div >
  )
}