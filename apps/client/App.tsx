import React, { useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  type Category,
  type ContentRecord,
  type SpinContext,
} from "@random/shared";
import { apiUrl, spin } from "./src/api";

const colors = {
  bg: "#F6F3FA",
  ink: "#252644",
  muted: "#74728A",
  purple: "#7760D4",
  lavender: "#E3DAF7",
  peach: "#F8DBC9",
};
function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (pressed || disabled) && { opacity: 0.6 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export default function App() {
  const [category, setCategory] = useState<Category>("EAT");
  const [item, setItem] = useState<ContentRecord | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [milk, setMilk] = useState(false);
  const [wheat, setWheat] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const lock = useRef(false);
  async function choose(again = false) {
    if (lock.current) return;
    const maxMinutes = minutes.trim() ? Number(minutes) : undefined;
    if (
      maxMinutes !== undefined &&
      (!Number.isInteger(maxMinutes) || maxMinutes < 1 || maxMinutes > 1440)
    ) {
      setMessage("Vrijeme treba biti cijeli broj od 1 do 1440 minuta.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setMessage("");
    setDetails(false);
    const ids = again && item ? [...excluded, item.id].slice(-200) : excluded;
    const context: SpinContext = {
      category,
      excludeIds: ids,
      excludedAllergens: [
        ...(milk ? ["milk" as const] : []),
        ...(wheat ? ["wheat" as const] : []),
      ],
      requiredDietaryTags: vegetarian ? ["vegetarian"] : [],
      maxMinutes,
    };
    try {
      const reduced = await AccessibilityInfo.isReduceMotionEnabled();
      rotation.setValue(0);
      const animation = new Promise<void>((resolve) => {
        if (reduced) return resolve();
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => resolve());
      });
      const [result] = await Promise.all([spin(context), animation]);
      setItem(result.item);
      setExcluded(ids);
      setMessage(
        result.item
          ? result.reason
          : "Nema nove preporuke za ova ograničenja. Vrati prethodne prijedloge; alergene i prehranu ćemo i dalje poštovati.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Veza trenutno nije dostupna.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function changeCategory(value: Category) {
    if (!busy) {
      setCategory(value);
      setItem(null);
      setExcluded([]);
      setMessage("");
      setDetails(false);
    }
  }
  const image = item
    ? apiUrl
      ? { uri: `${apiUrl}${item.image.path}` }
      : item.category === "EAT"
        ? require("./assets/demo-eat.png")
        : require("./assets/demo-book.png")
    : undefined;
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brand}>R A N D O M</Text>
            <Text style={s.tagline}>Decide Less. Live More.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => {
              if (!lock.current) setPreferences(!preferences);
            }}
            style={s.settings}
          >
            <Text style={s.small}>Tvoj izbor</Text>
          </Pressable>
        </View>
        {!apiUrl && (
          <Text style={s.demo}>
            LOKALNI DEMO · 2 primjera · nije tester katalog
          </Text>
        )}
        <View style={s.categories}>
          {(["EAT", "BOOK"] as const).map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: category === value }}
              disabled={busy}
              onPress={() => changeCategory(value)}
              style={[
                s.category,
                category === value && { backgroundColor: colors.ink },
              ]}
            >
              <Text style={[s.small, category === value && { color: "#fff" }]}>
                {value === "EAT" ? "EAT / nešto fino" : "BOOK / dobra knjiga"}
              </Text>
            </Pressable>
          ))}
        </View>
        {preferences && (
          <View style={s.panel}>
            <Text style={s.section}>Šta ti odgovara?</Text>
            <Text style={s.muted}>Postavke vrijede samo tokom ove sesije.</Text>
            {category === "EAT" && (
              <>
                {[
                  ["Bez mlijeka", milk, () => setMilk(!milk)],
                  ["Bez pšenice", wheat, () => setWheat(!wheat)],
                  [
                    "Vegetarijansko",
                    vegetarian,
                    () => setVegetarian(!vegetarian),
                  ],
                ].map(([label, checked, toggle]) => (
                  <Pressable
                    key={String(label)}
                    disabled={busy}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: Boolean(checked) }}
                    onPress={toggle as () => void}
                    style={s.option}
                  >
                    <Text style={s.body}>
                      {checked ? "☑" : "☐"} {String(label)}
                    </Text>
                  </Pressable>
                ))}
                <Text style={s.muted}>Najviše minuta (opcionalno)</Text>
                <TextInput
                  accessibilityLabel="Najviše minuta za pripremu"
                  editable={!busy}
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="number-pad"
                  placeholder="npr. 30"
                  style={s.input}
                />
                <Text style={s.muted}>
                  Ovo nisu svi mogući alergeni. Provjeri sastojke prije
                  pripreme.
                </Text>
              </>
            )}
            <Button
              secondary
              disabled={busy}
              label="Gotovo"
              onPress={() => {
                setPreferences(false);
                setItem(null);
                setExcluded([]);
              }}
            />
          </View>
        )}
        {!item ? (
          <View style={s.home}>
            <Text style={s.eyebrow}>MALO IZNENAĐENJE ZA TVOJ DAN</Text>
            <Text style={s.hero}>Manje razmišljanja.{"\n"}Više života.</Text>
            <Text style={s.subtitle}>
              {category === "EAT"
                ? "Jedan ukusan prijedlog, baš za sada."
                : "Sljedeća dobra priča počinje ovdje."}
            </Text>
            <View style={s.wheelStage}>
              <View style={s.pointer} />
              <Animated.View
                style={[
                  s.wheel,
                  {
                    transform: [
                      {
                        rotate: rotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "1080deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={s.wheelTop}>
                  <Text style={s.wheelWord}>
                    {category === "EAT" ? "NEŠTO FINO" : "DOBRA PRIČA"}
                  </Text>
                </View>
                <View style={s.wheelBottom}>
                  <Text style={s.wheelWord}>BAŠ ZA TEBE</Text>
                </View>
                <View style={s.center}>
                  <Text style={s.centerText}>{category}</Text>
                </View>
              </Animated.View>
            </View>
            <Button
              label={busy ? "Biramo…" : "SPIN  ↗"}
              disabled={busy}
              onPress={() => choose()}
            />
            <Text style={s.muted}>Jedan klik. Jedna dobra preporuka.</Text>
          </View>
        ) : (
          <View style={s.result}>
            <Text style={s.eyebrow}>
              TVOJ{" "}
              {item.category === "EAT" ? "DANAŠNJI ZALOGAJ" : "SLJEDEĆI NASLOV"}
            </Text>
            <Image
              accessibilityLabel={item.image.alt}
              source={image}
              style={s.image}
              resizeMode="cover"
            />
            <Text style={s.resultTitle}>{item.title}</Text>
            <Text style={s.subtitle}>{item.summary}</Text>
            <View style={s.chips}>
              {(item.category === "EAT"
                ? [`${item.totalMinutes} min`, `${item.servings} porcije`]
                : item.authors
              ).map((t) => (
                <Text key={t} style={s.chip}>
                  {t}
                </Text>
              ))}
            </View>
            <Button
              label={
                details
                  ? "Zatvori detalje"
                  : item.category === "EAT"
                    ? "Idemo kuhati →"
                    : "Upoznaj knjigu →"
              }
              onPress={() => setDetails(!details)}
            />
            {details && (
              <View style={s.panel}>
                {item.category === "EAT" ? (
                  <>
                    <Text style={s.section}>Sastojci</Text>
                    {item.ingredients.map((x, i) => (
                      <Text key={i} style={s.body}>
                        {x.quantity} {x.unit} · {x.name}
                      </Text>
                    ))}
                    <Text style={s.section}>Priprema</Text>
                    {item.steps.map((x, i) => (
                      <Text key={i} style={s.step}>
                        {i + 1}. {x}
                      </Text>
                    ))}
                    <Text style={s.muted}>
                      Alergeni:{" "}
                      {item.allergens.join(", ") || "nema evidentiranih"}.
                      Provjeri pakovanja i kontaminaciju.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={s.section}>Zašto ova knjiga?</Text>
                    <Text style={s.body}>{item.recommendationReason}</Text>
                    <Text style={s.muted}>{item.genres.join(" · ")}</Text>
                  </>
                )}
                <Text style={s.source}>Izvor: {item.source.label}</Text>
              </View>
            )}
            <Button
              secondary
              disabled={busy}
              label={busy ? "Biramo…" : "SPIN AGAIN ↻"}
              onPress={() => choose(true)}
            />
          </View>
        )}
        {!!message && (
          <Text accessibilityLiveRegion="polite" style={s.message}>
            {message}
          </Text>
        )}
        {!item && excluded.length > 0 && (
          <Button
            secondary
            label="Vrati prethodne prijedloge"
            disabled={busy}
            onPress={() => {
              setExcluded([]);
              setMessage("Prethodni prijedlozi su ponovo dostupni.");
            }}
          />
        )}
        <View style={s.footer}>
          <Text style={s.star}>✦</Text>
          <Text style={s.muted}>Dobra odluka. Mali korak.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  page: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    padding: 24,
    paddingTop: Platform.OS === "android" ? 46 : 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  brand: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 3,
  },
  tagline: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 8,
    letterSpacing: 1,
  },
  settings: {
    borderWidth: 1,
    borderColor: "#DED8EB",
    borderRadius: 24,
    padding: 12,
  },
  small: { color: colors.ink, fontSize: 12 },
  demo: { color: colors.muted, fontSize: 10, marginBottom: 16 },
  categories: {
    flexDirection: "row",
    gap: 8,
    padding: 5,
    borderRadius: 28,
    backgroundColor: "#EAE5F2",
  },
  category: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 24,
  },
  home: { alignItems: "center", paddingTop: 32 },
  eyebrow: {
    color: colors.purple,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 14,
  },
  hero: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 43,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  wheelStage: { marginVertical: 32, paddingTop: 10, alignItems: "center" },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.ink,
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
  wheel: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
    borderColor: "#fff",
    backgroundColor: colors.lavender,
    overflow: "hidden",
  },
  wheelTop: {
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lavender,
  },
  wheelBottom: {
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.peach,
  },
  wheelWord: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },
  center: {
    position: "absolute",
    top: 84,
    left: 84,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: { fontSize: 18, fontWeight: "800", color: colors.ink },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  secondary: { backgroundColor: "#EAE5F2" },
  result: { marginTop: 30 },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: colors.lavender,
    borderRadius: 32,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
    fontWeight: "700",
    textAlign: "center",
  },
  chips: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    fontSize: 12,
    backgroundColor: "#EAE5F2",
    padding: 10,
    borderRadius: 16,
    color: colors.ink,
  },
  panel: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginTop: 16,
  },
  option: { paddingVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD6ED",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    color: colors.ink,
  },
  section: {
    fontSize: 19,
    color: colors.ink,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 12,
  },
  body: { fontSize: 15, color: colors.ink, lineHeight: 24 },
  step: { fontSize: 15, color: colors.ink, lineHeight: 24, marginBottom: 14 },
  muted: { color: colors.muted, fontSize: 12, lineHeight: 20 },
  source: { fontSize: 11, color: colors.muted, marginTop: 16 },
  message: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 22,
    padding: 16,
    marginTop: 16,
    backgroundColor: "#EAE5F2",
    borderRadius: 16,
  },
  footer: { alignItems: "center", marginTop: 32, gap: 8 },
  star: { color: colors.purple, fontSize: 24 },
});
