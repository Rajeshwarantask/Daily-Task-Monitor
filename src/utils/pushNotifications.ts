//const VAPID_PUBLIC_KEY = "BBIxcuWysva7NU0Am5bXORnugcYEW71DlVQ7-opsy62uQTfIwWKhm4lKY965lXUuuJpSl9fyNVbINJgiKS0f6ek";

export async function subscribeUserToPush(userName: string) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BBIxcuWysva7NU0Am5bXORnugcYEW71DlVQ7-opsy62uQTfIwWKhm4lKY965lXUuuJpSl9fyNVbINJgiKS0f6ek",
      });
      console.log("Push subscription created", subscription);
    } else {
      console.log("Push subscription already exists", subscription);
    }

    // Send subscription to backend
    await fetch("/api/subscription/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subscription,  // use the actual subscription object
        userName: userName
      })
    });
  } else {
    console.warn("Push messaging is not supported");
  }
}
