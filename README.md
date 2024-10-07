# WalkMe Capture
![image](https://github.com/user-attachments/assets/f11c6291-0fa6-44cc-831d-e7e4c5be5269)

WalkMe Capture is a library designed to help create step details for the WalkMe library. It provides an interactive interface to capture and edit steps, which can then be used to guide users through a website.

## Getting Started

To buld WalkMe Capture, ensure you have `pnpm` and Node.js version 20 or above installed.

### Installation

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/yourusername/walkme-capture.git
cd walkme-capture
```

Install the dependencies using `pnpm`:

```bash
pnpm install
```

### Scripts

Here are the available scripts in the `package.json`:

- **Development**: Start the development server.
  ```bash
  pnpm dev
  ```
- **Build**: Build the project using `tsup`.
  ```bash
  pnpm build
  ```
## Usage

After building the project, it will generate a js and a css file with unique names include the generated JS and css files in your HTML file. This will create two floating, collapsible, and draggable modals:

1. **Capture Modal**: For capturing new steps or editing existing ones.
2. **Saved Steps**: For showing or editing previously captured step flows.

### WalkMe Capture Functionality

- **Element Identification**: When you hover over an element, the library will attempt to uniquely identify it. If the element is identifiable, a box with a blue fill and blue border will appear around it. Clicking on the element will prompt you to enter a step name and description (the name is required). Once these details are filled in, a new step of the `Step` type will be created. If the element is not identifiable, a box with a red fill and red border will be shown.
![image](https://github.com/user-attachments/assets/ee712629-46f4-4fe3-8384-20f769a9e7e2)
![image](https://github.com/user-attachments/assets/1c90d07e-4443-4be8-ba2d-c0c3f45375a9)

- **Step Creation**: When you finish creating steps, click the save button. This will save the data into the IndexedDB store, log it to the console, and display the saved flow in the second modal.

- **Integration with WalkMe**: You can set the outputted data to the WalkMe library, which will guide users through all the recorded steps.
![image](https://github.com/user-attachments/assets/84abe27a-9e18-4e25-aba4-42002dfe9549)

### Example

Here's an example of how to use generated walkme-capture library:
```html
<head>
    <script type="module" crossorigin src="/index-Codv4F68.js"></script>
    <link rel="stylesheet" crossorigin href="/index-DcaWPbHS.css">
  </head>
``` 

Here's an example of how to use the Captured data into WalkMe library:

```typescript
import WalkMe from 'walkme';

const exampleCapturedData = {
  _id: '1',
  title: 'Welcome Tour',
  url: '/home',
  learned: false,
  steps: [
    {
      _id: '1-1',
      title: 'Step 1',
      description: 'This is the first step.',
      target: '#step1'
    },
    {
      _id: '1-2',
      title: 'Step 2',
      description: 'This is the second step.',
      target: '#step2'
    }
  ]
};

const walkmeProps = {
  stepData: exampleCapturedData,
  onFinish: (stepData) => {
    console.log('Tour finished:', stepData);
  },
  onError: (error) => {
    console.error('Error during tour:', error);
  },
  onSkip: (stepData) => {
    console.log('Tour skipped:', stepData);
  }
};

const walkMeInstance = new WalkMe(walkmeProps);
walkMeInstance.start();
```

### Types

```typescript
export type StepData = {
  _id: string;
  title: string;
  url: string;
  learned: boolean;
  description?: string;
  steps: Step[];
};

export type Step = {
  title: string;
  description?: string;
  target?: string;
  _id: string;
};
```


![image](https://github.com/user-attachments/assets/f11c6291-0fa6-44cc-831d-e7e4c5be5269)
![image](https://github.com/user-attachments/assets/cab41f3f-f1a2-4065-8e3c-35f97610b167)
![image](https://github.com/user-attachments/assets/a5eaca74-e603-4e3b-a6f3-cb92e50cf163)
![image](https://github.com/user-attachments/assets/ee712629-46f4-4fe3-8384-20f769a9e7e2)
![image](https://github.com/user-attachments/assets/1c90d07e-4443-4be8-ba2d-c0c3f45375a9)

