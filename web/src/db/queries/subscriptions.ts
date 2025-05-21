import { db } from ".."
import { NewSubscription, subscriptions } from "../schemas/subscriptions"
// import { NewSubscription } from "../schemas/subscriptions"

const insertSubscription = async (subscription: NewSubscription) => {
  console.log('---- insertSubscription', subscription)
  const [result] = await db
    .insert(subscriptions)
    .values(subscription)
    .returning()
  return result
}

export { insertSubscription }