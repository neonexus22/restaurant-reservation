import RestaurantNavbar from "../components/RestaurantNavbar";
import Menu from "../components/Menu";
import { getDbConnection } from "../../../../utils/getDbConnection";

const prism = getDbConnection();

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prism.restaurant.findUnique({
    where: { slug },
    select: {
      items: true,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return restaurant.items;
};

async function RestaurantMenu({ params }: { params: { slug: string } }) {
  const menu = await fetchRestaurantMenu(params.slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}

export default RestaurantMenu;
