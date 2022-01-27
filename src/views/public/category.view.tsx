import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { Grid, Menu, Input, Modal, Button, Icon } from "semantic-ui-react";
import { Category } from "../../components/categories";
import { Product } from "../../components/products";
import API, { CategoryType, ProductType } from "../../dataLayer/api"
import { useGlobalContext } from "../../contexts/global.context";

type ParamType = {
  categoryId?: string,
  productId?: string
}

type LoadersState = {
  connecting?: boolean;
  disconnecting?: boolean;
  fetching?: boolean;
}

export function CategoryView() {
  const { categoryId, productId } = useParams<ParamType>()
  const { state: { loggedIn, user } } = useGlobalContext();
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string | undefined>()
  const [loaders, setLoaders] = useState<LoadersState>({})
  const navigate = useNavigate()

  const { data: categories } = useQuery(["shopzone"], async () => {
    const { data, status } = await API.getCategories()
    return data
  })

  const { data: usersCart, refetch: refetchUsersCart } = useQuery(["usersCart", user?.username], async () => {
    if (!user?.username) {
      return Promise.resolve([])
    }
    const { data, status } = await API.getUsersCart(user?.username)
    return data || []
  })

  // Search Handler
  const handleSearch = ({ target: { value } }: any) => {
    setSearch(value);
  }

  // categories
  const filteredcategories = useMemo(() => {
    if (!search) {
      return categories;
    }
    const searchLowered = search?.toLowerCase();
    return categories?.filter((category) => JSON.stringify(Object.values(category)).toLowerCase().includes(searchLowered))
  }, [search, categories])

  const category = useMemo(() => {
    return categories?.find((category) => String(category.id) === categoryId)
  }, [categoryId, categories])

  const product = useMemo(() => {
    return category?.items.find((product: any) => String(product.id) === productId)
  }, [productId, category])

  // category Selector
  const handleSelectCategory = (categoryId: number) => () => {
    navigate(`/shopzone/${categoryId}`)
  }

  // Connect Handler
  const handleConnect = async (product: ProductType) => {
    if (!loggedIn) {
      setModalOpen(true)
    } else if (user?.username && category) {
      setLoaders({ connecting: true })
      await API.addToUsersCart(user?.username, category.id, product.id);
      setLoaders({ fetching: true })
      await refetchUsersCart()
      setLoaders({})
    }
  }

  const handleDisconnect = async (product: ProductType) => {
    if (!user?.username) {
      return
    }
    setLoaders({ connecting: true })
    await API.removeFromUsersCart(user?.username, product.id);
    setLoaders({ fetching: true })
    await refetchUsersCart()
    setLoaders({})
  }

  const closeModal = () => setModalOpen(false)

  const handleNavigate = (to: string) => () => {
    navigate(to)
  }

  return (
    <div>
      <Grid>
        <Grid.Row className="searchBar">
          <Input size="large" onChange={handleSearch} />
        </Grid.Row>

        <Grid.Row>
          <Menu tabular style={{ opacity: loaders.fetching ? '0.4' : '1' }}>
            {filteredcategories?.map((category) => (
              <Menu.Item
                active={String(category.id) === categoryId}
                key={category.id}
                onClick={handleSelectCategory(category.id)}
              >
                {usersCart?.includes(category.id) && <Icon name="star" />} {category.name}
              </Menu.Item>)
            )}
          </Menu>
        </Grid.Row>

        <Grid.Column width={5}>
          {category ? (
            <Category
              category={category}
            />
          ) : (
            <h2>Please Select a category</h2>
          )}
        </Grid.Column>

        <Grid.Row>{product && (
          <Product
            product={product}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        )}</Grid.Row>

      </Grid>

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Modal.Header>
          You Must Be Logged In
        </Modal.Header>
        <Modal.Content>
          Please Log In or Sign Up to add a category to your cart
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleNavigate(`/login?redirect=/shopzone/${categoryId}`)}>Log In</Button>
          <Button primary onClick={handleNavigate(`/sign-up?redirect=/shopzone/${categoryId}`)}>Sign Up</Button>
          <Button secondary onClick={closeModal}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div >
  )
}