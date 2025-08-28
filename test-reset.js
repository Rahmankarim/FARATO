const testPasswordReset = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "rahmankarim2468@gmail.com",
        }),
      }
    );

    const data = await response.json();
    console.log("=== PASSWORD RESET TEST RESULT ===");
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.resetLink) {
      console.log("\n🔗 DIRECT RESET LINK:");
      console.log(data.resetLink);
      console.log(
        "\n📋 Copy this link and paste it in your browser to reset your password!"
      );
    }

    if (data.emailInfo) {
      console.log("\n📧 Email Info:", data.emailInfo);
    }

    return data;
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Run the test
testPasswordReset();
