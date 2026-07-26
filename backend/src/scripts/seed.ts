import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

/* ------------------------------------------------------------------ */
/*  medistore — custom INR seed                                        */
/*  Sets up an India / INR store and the 9 medistore products across   */
/*  the Vitamins / Syrups / Supplements categories.                    */
/*  MRP and pack size are stored in product.metadata so the storefront */
/*  can show the strike-through MRP and the "4 softgels" style unit.   */
/* ------------------------------------------------------------------ */

type SeedProduct = {
  title: string;
  handle: string;
  category: "Vitamins" | "Syrups" | "Supplements";
  price: number; // selling price in ₹
  mrp: number; // MRP in ₹
  unit: string; // pack description
  description: string;
  sku: string;
};

const PRODUCTS: SeedProduct[] = [
  {
    title: "Vitamin D3 60K",
    handle: "vitamin-d3-60k",
    category: "Vitamins",
    price: 149,
    mrp: 199,
    unit: "60,000 IU · 4 softgels",
    sku: "MED-VIT-D3-60K",
    description:
      "High-strength Vitamin D3 60,000 IU softgels to support bone health, immunity and calcium absorption. One softgel weekly as directed.",
  },
  {
    title: "Vitamin C Chewable",
    handle: "vitamin-c-chewable",
    category: "Vitamins",
    price: 189,
    mrp: 240,
    unit: "500mg · 30 tablets",
    sku: "MED-VIT-C-500",
    description:
      "Tangy orange chewable Vitamin C 500mg tablets. A daily antioxidant boost that supports immunity and skin health.",
  },
  {
    title: "Multivitamin Daily",
    handle: "multivitamin-daily",
    category: "Vitamins",
    price: 320,
    mrp: 399,
    unit: "30 tablets",
    sku: "MED-MULTI-30",
    description:
      "A complete daily multivitamin with 23 essential vitamins and minerals to fill everyday nutritional gaps and sustain energy.",
  },
  {
    title: "Cough Relief Syrup",
    handle: "cough-relief-syrup",
    category: "Syrups",
    price: 95,
    mrp: 120,
    unit: "100ml",
    sku: "MED-SYR-COUGH-100",
    description:
      "Soothing herbal cough relief syrup that calms dry and productive coughs and eases throat irritation. Suitable for adults and children above 6.",
  },
  {
    title: "Digestive Syrup",
    handle: "digestive-syrup",
    category: "Syrups",
    price: 130,
    mrp: 160,
    unit: "170ml",
    sku: "MED-SYR-DIGEST-170",
    description:
      "An ayurvedic digestive syrup that supports smooth digestion, relieves bloating and acidity, and improves appetite.",
  },
  {
    title: "Iron Folic Syrup",
    handle: "iron-folic-syrup",
    category: "Syrups",
    price: 110,
    mrp: 140,
    unit: "200ml",
    sku: "MED-SYR-IRON-200",
    description:
      "Iron with folic acid syrup to support healthy haemoglobin levels and combat iron-deficiency fatigue. Gentle on the stomach.",
  },
  {
    title: "Omega-3 Fish Oil",
    handle: "omega-3-fish-oil",
    category: "Supplements",
    price: 449,
    mrp: 599,
    unit: "60 capsules",
    sku: "MED-SUP-OMEGA3-60",
    description:
      "Triple-strength Omega-3 fish oil with EPA and DHA for heart, brain and joint health. Enteric-coated for no fishy after-taste.",
  },
  {
    title: "Calcium + Magnesium",
    handle: "calcium-magnesium",
    category: "Supplements",
    price: 275,
    mrp: 350,
    unit: "60 tablets",
    sku: "MED-SUP-CALMAG-60",
    description:
      "Calcium and magnesium with Vitamin D3 for stronger bones, teeth and muscle function. Ideal for adults and the elderly.",
  },
  {
    title: "Protein Immunity Powder",
    handle: "protein-immunity-powder",
    category: "Supplements",
    price: 399,
    mrp: 499,
    unit: "200g jar",
    sku: "MED-SUP-PROTEIN-200",
    description:
      "A daily protein and immunity powder with whey protein, vitamins and zinc. Mixes easily into milk or water — chocolate flavour.",
  },
];

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["in"];

  logger.info("Seeding store data (medistore / INR)...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Medistore Online",
          description: "Default sales channel for the medistore storefront",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Medistore Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "medistore",
          supported_currencies: [
            {
              currency_code: "inr",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];

  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "India Warehouse",
          address: {
            city: "Mumbai",
            country_code: "IN",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const { data: existingShippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  let shippingProfile = existingShippingProfiles[0];
  if (!shippingProfile) {
    const {
      result: [createdShippingProfile],
    } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [{ name: "Default Shipping Profile", type: "default" }],
      },
    });
    shippingProfile = createdShippingProfile;
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "India Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [
          {
            country_code: "in",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 3-5 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 40,
          },
          {
            region_id: region.id,
            amount: 40,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivered next business day.",
          code: "express",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 90,
          },
          {
            region_id: region.id,
            amount: 90,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location & fulfillment data.");

  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Vitamins", is_active: true },
        { name: "Syrups", is_active: true },
        { name: "Supplements", is_active: true },
      ],
    },
  });

  const categoryId = (name: string) =>
    categoryResult.find((c) => c.name === name)!.id;

  logger.info("Seeding products...");
  await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTS.map((p) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        category_ids: [categoryId(p.category)],
        shipping_profile_id: shippingProfile.id,
        weight: 200,
        // MRP + pack size live in metadata for the storefront to read
        metadata: {
          mrp: p.mrp,
          unit: p.unit,
          category: p.category,
        },
        options: [
          {
            title: "Pack",
            values: ["Default"],
          },
        ],
        variants: [
          {
            title: p.unit,
            sku: p.sku,
            manage_inventory: true,
            options: {
              Pack: "Default",
            },
            prices: [
              {
                amount: p.price,
                currency_code: "inr",
              },
            ],
          },
        ],
        sales_channels: [{ id: defaultSalesChannel.id }],
      })),
    },
  });
  logger.info("Finished seeding products.");

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 500,
        inventory_item_id: item.id,
      })),
    },
  });
  logger.info("Finished seeding inventory levels.");

  logger.info(
    `\n==================== MEDISTORE SEED COMPLETE ====================\n` +
      `Publishable API Key (put this in frontend/.env.local as\n` +
      `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY):\n\n    ${publishableApiKey.token}\n\n` +
      `================================================================\n`
  );
}
