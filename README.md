# My Next.js App with Tailwind and TypeScript

Welcome to my Next.js application, which is integrated with Tailwind CSS for a modern look and TypeScript for added type safety.

## Pre-requisites

Node.js (preferably the latest LTS version)
npm or Yarn (depending on your preference)
## Installation & Setup

Follow these steps to run the application on your local machine:

### 1. Clone the Repository

```bash
git clone [Your Repository URL]
cd [Your Repository Directory]
```

### 2. Install Dependencies

```bash
npm install
```
Or, if you use Yarn:

```bash
yarn install
```

### 3. Running the Application

To run the development server:

```bash
npm run dev
```
Or with Yarn:

```bash
yarn dev
```

Once the server is running, you can access the app at http://localhost:3000.
THIS APP DEPENDS ON "sales-dashboard-demo-api"

## Troubleshooting

If you encounter any issues, ensure:

Your Node.js version is up to date.
All dependencies were installed correctly. If in doubt, delete the node_modules folder and the package-lock.json (or yarn.lock if using Yarn) and run the installation step again.

# Usage

This main component is, \_LeadsDashboard\_, a dashboard for managing leads. It allows users to add, edit, and delete leads based on certain criteria like name, email, status, and estimated sale amount. The component interacts with a backend API to fetch, create, edit, and delete the leads data. The data is paginated and the component also allows the users to change the page and the page size.

# Features:

- **Pagination**: The dashboard is paginated, enabling users to navigate between different pages of leads.
- **Add a New Lead**: Users can add a new lead by providing a name, email, status, and estimated sale amount.
- **Edit a Lead**: Users can edit an existing lead's details.
- **Delete a Lead**: Users can delete a lead either by its ID or email. A confirmation alert ensures accidental deletions are minimized.
- **Validation**: The component includes email validation to ensure the email provided is in a valid format.
- **Authentication**: Every request to the backend is authenticated using a token stored in window.sessionStorage. Unauthenticated users on /leads pages get bumped to login page.
- **Frontend Automation**: Lots of prepoulated fields, a thoughtfully designed details to enhance UX including ID -> Email visual confirmation on deletion, and Auto Fill edit fields by clicking on table rows.

# Usage Steps:

## Login:

- http/localhost:3000/ maps to /login for now. Upon starting the app, you will need to login.
-User creation is handled via django backend (sales-dashboard-demo-api). There is no way to create user on front end.


## Pagination Controls:

- Use pagination controls to navigate between pages of leads. You can also adjust the page size (number of leads displayed per page).

## Adding a Lead:

- Click on the 'Add' button denoted by a plus inside a circle.
- Fill in the required details.
- Click 'Add Lead' to save the new lead.

## Editing a Lead:

- Click on the 'Edit' button denoted by Three Horizontal Bars and a Pencil.
- Modify the required details OR click on a user from the table to pre-populate information.
- Click 'Edit Lead' to save changes.

## Deleting a Lead:

- Click on the 'Delete' button denoted by a minus inside a circle.
- Enter id or email. Entering a valid email or id will pre-populate details.
- Click 'Delete Lead' to initiate deletion
- Confirm the deletion in the confirmation popup, or cancel to avoid deletion.

## Logout:

- Click on the 'Logout' button denoted by a Rectangle vertical and an arrow.
- Click 'Logout' to go to /logout and get pushed to login page.

## Handling Invalid Entries:

- If an invalid email is provided, a 'Invalid Email' message is displayed.

## Dependencies:

- axios: For making HTTP requests.
- @mui/icons-material: For Material-UI icons.
- next/router: To navigate between Next.js routes.
- Typescript: Type enforcing.
- Tailwind: Quick utility styling.

## Notes:

Ensure that the backend server is running and listening on http://127.0.0.1:8000/.
Make sure you handle the token securely and refresh it if it expires.
This is a general usage guide. Depending on the context of the application or system in which this component is deployed, additional setup or configuration steps may be necessary.
