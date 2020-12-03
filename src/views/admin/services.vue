<template>
  <adminLayout>
    <div slot="main">
      <v-container>
        <h2 class="mb-8">Reports</h2>

        <v-container>
          <ejs-grid
            v-if="type == 1"
            ref="grid"
            id="Grid"
            :dataSource="services"
            :allowPaging="true"
            :allowSorting="true"
            :allowFiltering="true"
            :allowGrouping="true"
            :pageSettings="pageSettings"
            :toolbar="toolbarOptions"
            :allowPdfExport="true"
            :toolbarClick="toolbarClick"
          >
            <e-columns>
              <e-column
                field="name"
                headerText="Name"
                textAlign="Left"
                width="90"
              ></e-column>
              <e-column
                field="category"
                headerText="Category"
                textAlign="Left"
                width="90"
              ></e-column>
              <e-column
                field="vendorName"
                headerText="Vendor"
                width="120"
              ></e-column>
              <e-column
                field="description"
                headerText="Description"
                textAlign="Left"
                format="C2"
                width="90"
              ></e-column>
            </e-columns>
          </ejs-grid>
        </v-container>
      </v-container>
    </div>
  </adminLayout>
</template>

<script>
import adminLayout from "@/components/admin_layout.vue";
import Vue from "vue";
import {
  GridPlugin,
  Page,
  Sort,
  Filter,
  Group,
  Toolbar,
  PdfExport,
  Aggregate
} from "@syncfusion/ej2-vue-grids";

Vue.use(GridPlugin);
import { db } from "@/firebase.js";
export default {
  name: "Admin",
  components: { adminLayout },
  data() {
    return {
      toolbarOptions: ["PdfExport"],

      services: [],
      type: 1
    };
  },
  provide: {
    grid: [Page, Sort, Filter, Group, Toolbar, PdfExport, Aggregate]
  },
  computed: {},
  methods: {
    toolbarClick(args) {
      if (args.item.id === "Grid_pdfexport") {
        // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
        this.$refs.grid.pdfExport({
          fileName: "Report.pdf",
          header: {
            fromTop: 0,
            height: 130,
            contents: [
              {
                type: "Text",
                value: "The Wedding Planning App",
                position: { x: 50, y: 50 },
                style: { textBrushColor: "#000000", fontSize: 20 }
              },
              {
                type: "Text",
                value: "Services Report",
                position: { x: 50, y: 80 },
                style: { textBrushColor: "#000000", fontSize: 14 }
              }
            ]
          },
          footer: {
            fromBottom: 160,
            height: 150,
            contents: [
              {
                type: "PageNumber",
                pageNumberType: "English",
                format: "Page {$current} of {$total}",
                position: { x: 0, y: 25 },
                style: { textBrushColor: "#000000", fontSize: 15 }
              }
            ]
          }
        });
      }
    },
    changeType: function(typeR) {
      this.type = typeR;
    },

    updateStatue: function() {}
  },
  created() {},
  firestore: {
    services: db.collection("services")
  }
};
</script>
