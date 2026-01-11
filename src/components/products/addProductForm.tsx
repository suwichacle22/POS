import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { products } from "@/db/schema";

const formProductSchema = z.object({
  productName: z.string().min(1, "โปรดใส่ชื่อ"),
  defaultSplitType: z.literal(["percentage", "per_kg"]),
});

const defaultSplitType = [
  { value: "percentage", label: "แบ่งส่วน แบบยาง" },
  { value: "per_kg", label: "ค่าตัด แบบปาล์ม" },
];

const formId = "add-product-form";

const submitFormProductServerFn = createServerFn({ method: "POST" })
  .inputValidator(formProductSchema)
  .handler(async ({ data }) => {
    console.log("server data:", data);
    try {
      await db.insert(products).values(data);
    } catch (e) {
      return { error: e };
    }
    return { success: true };
  });

export default function AddProductForm() {
  const addProductFn = useServerFn(submitFormProductServerFn);
  const form = useForm({
    defaultValues: {
      productName: "",
      defaultSplitType: "percentage",
    },
    validators: {
      onSubmit: formProductSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("form", value);
      try {
        await addProductFn({ data: value });
        form.reset();
      } catch {
        //TODO: add error when duplicate
      }
    },
  });
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>แบบฟอร์มเพิ่มสินค้า</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="productName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>เพิ่มสินค้า</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="off"
                      aria-invalid={isInvalid}
                      placeholder="ชื่อสินค้า ตัวอย่าง ยางแผ่น, ปาล์ม..."
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="defaultSplitType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldLabel>ประเภทการแบ่ง</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      items={defaultSplitType}
                      onValueChange={(e) => field.handleChange(e as string)}
                    >
                      <SelectTrigger
                        id="form-add-product-select-defaultSplitType"
                        aria-invalid={isInvalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="select..." />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectGroup>
                          {defaultSplitType.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form={formId}>
            ยืนยัน
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
