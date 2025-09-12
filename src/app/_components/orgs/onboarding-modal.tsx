"use client";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/text-area";
import { OrgValidationType, orgValidation } from "@/lib/validation/org-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import OrgSignoutButton from "./org-sign-out-button";

interface OnboardingModalProps {
  name: string;
  email: string;
}

const OnboardingModal: FC<OnboardingModalProps> = ({
  email: oAuthEmail,
  name: oAuthName,
}) => {
  const {
    handleSubmit,
    register,
    control,
    setError,
    setValue,
    watch,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<OrgValidationType>({
    resolver: zodResolver(orgValidation),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      organizationType: "institute",
      focusExams: [],
      contactEmail: oAuthEmail || "",
      phone: "",
      slug: "",
    },
  });

  const router = useRouter();

  const createOrg = api.org.createOrganisation.useMutation({
    onSuccess: (data) => {
      toast.success("Organization created successfully");
      router.push(data.redirect);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const generateSlug = function (name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    setValue("slug", slug);
  };

  const slugData = api.org.checkSlugAvailability.useQuery(
    {
      slug: watch("slug"),
    },
    {
      enabled: !!watch("slug"),
      refetchOnWindowFocus: false,
    }
  );

  const submitHandler = async function (formData: OrgValidationType) {
    try {
      await createOrg.mutateAsync(formData);
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        setError("root", { message: err.message });
      }
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-background  flex items-center justify-center gap-8 flex-col px-12 py-8 rounded-sm shadow-2xl max-w-7xl"
      >
        <h1 className="text-primary text-2xl md:text-3xl xl:text-4xl leading-normal text-center tracking-tight font-heading font-bold">
          Please update your details <br />
          {oAuthName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8">
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="name"
            >
              Name of the Organisation
            </label>
            <Input
              autoCapitalize="none"
              autoComplete="none"
              placeholder=" "
              id="name"
              disabled={isSubmitting}
              className="rounded-sm border-foreground/60 min-w-[325px]"
              required
              {...register("name", {
                onChange: (e) => generateSlug(e.target.value),
              })}
            />
            {errors?.name ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.name.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="contactEmail"
            >
              Email
            </label>
            <Input
              autoCapitalize="none"
              autoComplete="none"
              placeholder=" "
              id="contactEmail"
              disabled={isSubmitting}
              className="rounded-sm border-foreground/60 min-w-[325px]"
              required
              {...register("contactEmail")}
            />
            {errors?.contactEmail ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.contactEmail.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8">
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="phone"
            >
              Phone
            </label>
            <Input
              autoCapitalize="none"
              autoComplete="none"
              placeholder=" "
              id="phone"
              disabled={isSubmitting}
              className="rounded-sm border-foreground/60 min-w-[325px]"
              {...register("phone")}
            />
            {errors?.phone ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.phone.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50  text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="organizationType"
            >
              Organisation *
            </label>
            <Controller
              control={control}
              name="organizationType"
              render={({ field: { onChange, value } }) => (
                <select
                  id="organizationType"
                  defaultValue={"institute"}
                  className="border border-foreground/50 w-full px-2 py-2.5 rounded-sm"
                  onChange={onChange}
                >
                  <option value={"institute"}>Creator</option>
                  <option value={"institute"}>Institute</option>
                  <option value={"tutor"}>Tutor</option>
                  <option value={"publisher"}>Publisher</option>
                </select>
              )}
            />
            {errors?.organizationType ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.organizationType.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-start justify-center gap-8">
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="website"
            >
              Website
            </label>
            <Input
              autoCapitalize="none"
              autoComplete="none"
              placeholder=" "
              id="website"
              disabled={isSubmitting}
              className="rounded-sm border-foreground/60 min-w-[325px]"
              {...register("website")}
            />
            {errors?.website ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.website.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="slug"
            >
              Slug *
            </label>
            <Input
              autoCapitalize="none"
              autoComplete="none"
              placeholder=" "
              id="slug"
              disabled={isSubmitting}
              className="rounded-sm border-foreground/60 min-w-[325px]"
              required
              {...register("slug")}
            />
            <p className="px-1 text-xs text-foreground/70 h-4">
              {`/org/${watch("slug") || "your-slug"}`}
            </p>
            {slugData.data && !slugData.data.available && watch("slug") && (
              <p className="px-1 text-xs text-destructive h-4">
                This slug is already taken
              </p>
            )}
            {slugData.data && slugData.data.available && watch("slug") && (
              <p className="px-1 text-xs text-primary h-4">
                This slug is available
              </p>
            )}
            {errors?.slug ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.slug.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 items-center justify-center gap-8 w-full">
          <div className="flex flex-col items-start justify-center gap-3">
            <label
              className="text-foreground/50 text-[16px] text-center leading-tight tracking-normal font-paragraph font-normal"
              htmlFor="focusExams"
            >
              Focus Exams
            </label>
            <Controller
              name="focusExams"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="grid md:grid-cols-3 xl:grid-cols-4 items-center justify-center gap-3 w-full">
                  {[
                    "JEE",
                    "NEET",
                    "GATE",
                    "CAT",
                    "UPSC",
                    "Banking",
                    "SSC",
                    "Other",
                  ].map((item, i) => (
                    <label
                      key={i}
                      htmlFor={item}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([...value, item]);
                          } else {
                            onChange(value.filter((el) => el !== item));
                          }
                        }}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-foreground/50 text-[14px] text-center leading-tight tracking-normal font-paragraph font-normal">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors?.focusExams ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.focusExams.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 items-start justify-start gap-2 w-full">
          <label
            className="text-foreground/50 text-[16px] leading-tight tracking-normal font-paragraph font-normal"
            htmlFor="description"
          >
            Description
          </label>
          <Textarea
            autoCapitalize="none"
            autoComplete="none"
            placeholder=" "
            id="description"
            disabled={isSubmitting}
            className="rounded-sm border-foreground/60 min-w-[325px]"
            {...register("description")}
          />
          {errors?.description ? (
            <p className="px-1 text-xs text-destructive h-4">
              {errors.description.message}
            </p>
          ) : (
            <p className="h-4"></p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </>
  );
};

export default OnboardingModal;
