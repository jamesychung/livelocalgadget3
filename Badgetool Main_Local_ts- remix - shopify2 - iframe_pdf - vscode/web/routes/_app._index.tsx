import React from "react";
import { Link } from "@remix-run/react";
import { Page, Card, Text, Box, Button, Layout, CalloutCard } from "@shopify/polaris";

// Updated index page with improved UI
export default function Index() {
  return (
    <Page title="All Quality Badges">
      <Layout>
        <Layout.Section>
          <CalloutCard
            title="Welcome to All Quality Badges"
            illustration="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
            primaryAction={{
              content: 'Start Designing Badges',
              url: '/badge-designer'
            }}
          >
            <p>Create professional name badges for your business. Design custom badges with your branding, customer information, and choose from multiple backing options.</p>
          </CalloutCard>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Text variant="headingMd" as="h2">
                Features
              </Text>
              <Box paddingBlockStart="200">
                <ul>
                  <li>• Custom text with up to 4 lines</li>
                  <li>• Multiple font options and sizes</li>
                  <li>• Color customization</li>
                  <li>• CSV bulk import</li>
                  <li>• PDF export for printing</li>
                  <li>• Pin, magnetic, or adhesive backing options</li>
                </ul>
              </Box>
              <Box paddingBlockStart="400">
                <Link to="/badge-designer">
                  <Button primary>
                    Open Badge Designer
                  </Button>
                </Link>
              </Box>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 