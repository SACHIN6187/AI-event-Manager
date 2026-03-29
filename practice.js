const { mutate: syncUserPlan } = useConvexMutation(
  api.users.syncUserPlan
);

const handleBillingSuccess = async () => {
  const hasPro = has?.({ plan: "pro" });

  await syncUserPlan({ hasPro: !!hasPro });
};