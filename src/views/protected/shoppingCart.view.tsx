import { useMemo } from "react"
import { useQuery } from "react-query"
import { useGlobalContext } from "../../contexts/global.context"
import API from "../../dataLayer/api"

export function SavedItemsView() {
  const { state: { user } } = useGlobalContext()
  const { data: products } = useQuery(["shopzone"], async () => {
    const { data, status } = await API.getProducts()
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
    return usersCart?.map((productId: number) => {
      return products?.find(({ id }) => productId === id)
    })
  }, [products, usersCart])

  return (
    <>
      <h2>Shopping Cart</h2>
      <pre>
        {JSON.stringify(cart, null, 2)}
      </pre>
    </>
  )
}