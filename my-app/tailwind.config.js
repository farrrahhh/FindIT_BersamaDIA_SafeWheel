/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#493D9E",
        secondary: "#B2A5FF",
        tertiary: "DAD2FF",
      },
      fontFamily: {
        poppinsRegular: "PoppinsRegular",
        poppinsSemiBold: "PoppinsSemiBold",
        poppinsBlack: "PoppinsBlack",
        poppinsMedium: "PoppinsMedium",
      },
    },
  },
  plugins: [],
};
