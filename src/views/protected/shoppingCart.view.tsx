import { useMemo } from "react"
import { useQuery } from "react-query"
import { Button, Grid, GridColumn } from "semantic-ui-react"
import { useGlobalContext } from "../../contexts/global.context"
import API from "../../dataLayer/api"

export function SavedItemsView() {
  const { state: { user } } = useGlobalContext()
  const { data: categories } = useQuery(["shopzone"], async () => {
    const { data, status } = await API.getCategories()
    return data
  })

  const { data: usersCart } = useQuery(["usersCart"], async () => {
    if (!user?.username) {
      return []
    }
    const { data, status } = await API.getUsersCart(user?.username)
    return data
  })

  const cart = useMemo(() => {
    return usersCart?.map(({ categoryId, productId }: any) => {
      return categories?.find(({ id }) => categoryId === id)?.items.find(({ id }) => id === productId)
    })
  }, [categories, usersCart])

  return (
    <Grid>
      <GridColumn>
        <h2>Shopping Cart</h2>
        <pre>
          {cart.map(
            ({ id, name, price }: any) => `${id} ${name}\n ${price}\n\n`
          ).join(' ')}
        </pre>
      </GridColumn>

      <GridColumn>
        <h2>Checkout</h2>
        <Button>Checkout</Button>
      </GridColumn>
    </Grid>
  )
}