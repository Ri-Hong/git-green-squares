# Git Green Squares 🟩

[![Editor Demo Site](https://img.shields.io/badge/Visit-Demo%20Site-brightgreen)](https://ri-hong.github.io/git-green-squares/)


**Git Green Squares** is a fun and practical tool designed to automatically fill your GitHub contribution graph with green squares by making daily commits on your behalf. Whether you're looking to maintain a consistent streak or just want a more colorful profile, this tool has got you covered!

Checkout the editor demo deployed on GitHub Pages at [Git Green Squares](https://ri-hong.github.io/git-green-squares/).

## 🚀 Features

- **Daily Automated Commits**: Automatically makes the required number of commits each day based on your configuration.
- **Custom Contribution Patterns**: Create and save custom contribution patterns using the web-based editor that will light up your GitHub contribution graph.

## 🖥️ Editor Features

The built-in editor offers a variety of tools to help you design your perfect GitHub contribution pattern:

- **Randomizer with Intensity Levels**: Generate random patterns with adjustable intensity to fill your graph with green squares.
- **Text to Pattern Generator**: Convert any text into a unique pattern that will be reflected in your contribution graph.
- **Utilities**:
  - **Undo/Redo**: Revert or reapply changes with the undo and redo buttons.
  - **Shift Left/Right**: Easily shift your entire pattern left or right to adjust the timing of your contributions.

## 🛠️ How It Works

1. **Setup Your Contribution Pattern**:
   - The editor empowers you to craft a unique and personalized contribution pattern for your GitHub profile.
   - Save your pattern, and it will be stored in `/public/contributions.json`.

2. **Automated Commits**:
   - A GitHub Actions workflow runs daily at midnight UTC.
   - The workflow reads `/public/contributions.json` to determine the number of commits to make for the current day.
   - The determined number of commits are made, updating `/public/contributions-status.json`.

## 🎯 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [GitHub Actions](https://docs.github.com/en/actions)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ri-Hong/git-green-squares.git
   cd git-green-squares
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Customize Your Pattern**:
   - Run `npm run dev` and head to [http://localhost:3000/git-green-squares](http://localhost:3000/git-green-squares) to see the editor.
   - Use the editor to create your pattern and when you're done, **don't forget to hit save!**

4. **Commit and Push**:
   - Save your changes and push them to GitHub using
   ```bash
   git add .
   git commit -m "Updated contributions.json"
   ```

5. **Enjoy Your Green Squares**:
   - The automated workflow will handle the rest!

## 📝 Notes

- **Local Usage**: There is no database associated with this project, so to use it, you must clone the project locally and run it on your machine.

## 📈 Future Enhancements

- **Pattern Sharing**: Empower users to easily import and export their contribution patterns, facilitating effortless sharing and collaboration on unique designs with others.
- **Varied Contribution Types**: Expand the GitHub Actions script to support diverse contribution activities, including creating pull requests, resolving issues, and performing code reviews, thereby enriching the types of contributions reflected on your GitHub graph.
- **Adaptive Commit Quotas**: Implement an adaptive commit strategy where the GitHub Actions script dynamically adjusts the number of commits based on the existing daily contributions, ensuring that the set quota for the day is accurately met.
- **Advanced Drawing Tools**: Introduce enhanced drawing features in the editor, such as click-and-drag to draw, adjustable brush sizes, and more, allowing for greater precision and creativity in pattern design.

---

Enjoy filling up your GitHub contribution graph with **Git Green Squares**! 🌱✨
