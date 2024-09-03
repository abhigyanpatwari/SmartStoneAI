# AI-Powered Milestone Planning Assistant

Welcome to the future of project management! This sophisticated AI assistant leverages the power of GPT-4 and advanced natural language processing to transform complex project descriptions into clear, actionable milestones.

## Overview

Our AI Milestone Planning Assistant is designed to streamline the project planning process by intelligently breaking down intricate projects into manageable, time-bound milestones. By harnessing the capabilities of OpenAI's GPT-4 model and the robust LangChain framework, we've created a tool that understands the nuances of your project and provides tailored, insightful planning recommendations.

## Key Features

- **Advanced Language Model**: Utilizes OpenAI's GPT-4 for unparalleled natural language understanding and generation.
- **Intelligent Milestone Extraction**: Automatically identifies and creates logical project milestones from detailed descriptions.
- **Dynamic Time Allocation**: Smartly distributes project duration across milestones based on complexity and scope.
- **Interactive Refinement**: Allows users to modify and fine-tune generated milestones through an intuitive interface.
- **Persistent Storage**: Employs SQLite for efficient, lightweight data management of project histories and milestone data.
- **Evaluation Metrics**: Includes a cosine similarity checker to ensure alignment between project descriptions and generated milestones.

## Technology Stack

- **Backend**: 
  - Python with FastAPI for high-performance, asynchronous API development
  - LangChain for seamless integration with language models and prompt engineering
  - SQLite for robust, serverless database management
  - Azure OpenAI Services for secure, scalable AI model deployment

- **Frontend**:
  - React for building a dynamic and responsive user interface
  - Tailwind CSS for sleek, modern styling
  - Shadcn UI for beautifully designed, accessible React components
  - Axios for efficient API communication

## How It Works

1. **Project Input**: Users provide a detailed project description and parameters such as total duration.
2. **AI Processing**: Our system leverages GPT-4 through LangChain to analyze the project details.
3. **Milestone Generation**: The AI breaks down the project into logical, time-bound milestones.
4. **Interactive Refinement**: Users can view, edit, and refine the generated milestones through our intuitive interface.
5. **Persistent Storage**: All project data and milestones are securely stored in our SQLite database for easy retrieval and updates.

## Getting Started

Follow these steps to set up the AI Milestone Planning Assistant on your local machine:

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- An Azure account with access to Azure OpenAI Services

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-milestone-planner.git
   cd ai-milestone-planner/backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up your environment variables:
   - Create a `.env` file in the `backend` directory
   - Add the following variables, replacing the values with your Azure OpenAI credentials:
     ```
     AZURE_OPENAI_API_KEY=your_api_key
     AZURE_OPENAI_API_BASE=your_api_base
     AZURE_OPENAI_API_VERSION=your_api_version
     AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
     ```

5. Run the FastAPI server:
   ```
   uvicorn api:app --reload
   ```

   The backend should now be running on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend should now be running on `http://localhost:5173`.

### Using the Application

1. Open your web browser and go to `http://localhost:5173`.
2. You should see the AI Milestone Planning Assistant interface.
3. Enter your project details, including the project description and duration.
4. Click "Submit" to generate milestones.
5. Review, edit, and refine the generated milestones as needed.

### Troubleshooting

- If you encounter any issues with the backend, make sure your Azure OpenAI credentials are correct and that you have the necessary permissions.
- For frontend issues, check the console in your web browser's developer tools for any error messages.

If you need further assistance, please open an issue in the GitHub repository.

## Contributing

We welcome contributions to enhance the capabilities of our AI Milestone Planning Assistant. Please refer to our contribution guidelines for more information.

## Acknowledgments

- OpenAI for their groundbreaking GPT-4 model
- LangChain for their excellent framework that bridges AI models with applications
- Shadcn UI for providing a beautiful, customizable component library
- The open-source community for their invaluable contributions to the tools and libraries used in this project

Embark on a journey of efficient project planning with our AI Milestone Planning Assistant – where complex projects meet intelligent simplification!
