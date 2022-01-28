import { Link } from "react-router-dom";
import { CategoryType } from "../../dataLayer/api";

type Props = {
  category: CategoryType;
}

export function Category({ category }: Props) {
  return (
    <div>
      <div>
        <h3>{category.name}</h3>
      </div>

      <div>
        <p>{category.description}</p>
      </div>

      <div>
        {category.items.map(({ id, price, name }) => (
          <Link to={`/shopzone/${category.id}/products/${id}`}><li key={id}>{price} {name}</li></Link>
        ))}
      </div>
    </div>
  )
}