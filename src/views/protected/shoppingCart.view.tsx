import { useMemo } from "react"
import { useQuery } from "react-query"
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
    <>
      <h2>Shopping Cart</h2>
      <pre>
        {JSON.stringify(cart, null, 2)}
      </pre>
    </>
  )
}