// =======================================================
//             THƯ VIỆN UI CHỌN CÂY CHO MOD
// =======================================================
// File: ModPlantSelectorLib.cs
// Version: 1.3.1 (Fix: Tìm template sớm, hỗ trợ layout riêng)
// Author: YourName (Thay bằng tên bạn)
// Description: Cung cấp UI chọn cây riêng cho các mod, tìm template sớm hơn,
//              hỗ trợ cấu hình template và offset (X, Y) riêng lẻ,
//              và sửa lỗi vị trí thẻ khi bỏ chọn.
// =======================================================

// =======================================================
//                       USING STATEMENTS
// =======================================================
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime;
using Il2CppInterop.Runtime.Injection;
using Il2CppSystem.Collections.Generic; // Sử dụng List<T> của Il2Cpp nếu cần tương tác trực tiếp
using Il2CppTMPro;
using MelonLoader;
using System;
using System.Collections;
// using System.Collections.Generic; // Dùng của System cho Dictionary, List nội bộ
using System.Linq;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.SceneManagement; // Cần cho FindObjectIncludingInactive
using UnityEngine.UI;
using Il2CppSystem; // Cần cho Action


// =======================================================
//                       THUỘC TÍNH ASSEMBLY
// =======================================================
[assembly: MelonInfo(typeof(GiaoDienTuyChinh.Core), "PvzRhTomiSakaeMods v1.0 - GiaoDienTuyChinh", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPriority(1000)]

// =======================================================
//                       NAMESPACE CHUNG
// =======================================================
namespace GiaoDienTuyChinh
{
    // =======================================================
    //                       LÕI MOD THƯ VIỆN
    // =======================================================
    public class Core : MelonMod
    {
        public override void OnInitializeMelon()
        {
            MelonLogger.Msg("Thư viện Mod GiaoDienTuyChinh đã khởi tạo (v1.0.0).");
        }
    }

    // =======================================================
    //              STRUCT LƯU THÔNG TIN CÂY MOD (Giữ nguyên từ 1.3.0)
    // =======================================================
    public struct ModPlantInfo
    {
        public int PlantId;
        public string PlantName;
        public Sprite SeedPacketSprite;
        public string TemplateObjectName; // Tên template mong muốn (có thể null -> dùng mặc định)
        public float ContentOffsetX;
        public float ContentOffsetY;
    }

    // =======================================================
    //                  LỚP QUẢN LÝ UI CHÍNH (ĐÃ SỬA)
    // =======================================================
    public static class ModPlantUISystem
    {
        // --- Các biến Static ---
        private static System.Collections.Generic.List<ModPlantInfo> registeredModPlants = new System.Collections.Generic.List<ModPlantInfo>();
        private static System.Collections.Generic.List<GameObject> originalSlots = new System.Collections.Generic.List<GameObject>();
        private static System.Collections.Generic.List<GameObject> createdModSlots = new System.Collections.Generic.List<GameObject>();
        private static System.Collections.Generic.Dictionary<int, GameObject> modSlotInteractableCards = new System.Collections.Generic.Dictionary<int, GameObject>();
        private static Transform gridParent = null;
        internal static GameObject modPlantsButtonInstance = null;
        private static bool isShowingModPlantView = false;
        private static System.Collections.Generic.Dictionary<int, CardPositionData> modCardOriginalPositions = new System.Collections.Generic.Dictionary<int, CardPositionData>();

        // --- THAY ĐỔI: Lưu trữ các template đã tìm thấy ---
        // Key: Tên template (string), Value: Instance GameObject đã tìm thấy
        private static System.Collections.Generic.Dictionary<string, GameObject> foundTemplates = new System.Collections.Generic.Dictionary<string, GameObject>();
        private static string defaultPlantTemplateName = "Blover"; // Template mặc định

        // --- THAY ĐỔI: Danh sách các tên template cần tìm sớm ---
        private static System.Collections.Generic.HashSet<string> requiredTemplateNames = new System.Collections.Generic.HashSet<string>() { defaultPlantTemplateName }; // Luôn cần tìm template mặc định

        // Struct phụ trợ để lưu dữ liệu RectTransform gốc
        internal struct CardPositionData
        { /* ... Giữ nguyên ... */
            public Vector2 AnchoredPosition;
            public Vector2 AnchorMin;
            public Vector2 AnchorMax;
            public Vector2 Pivot;
            public Vector2 SizeDelta;
        }

        // --- Cấu hình Nút Bấm (Như cũ) ---
        private static string buttonText = "Cây Mod";
        private static Vector2 buttonAnchorMin = new Vector2(1, 0);
        private static Vector2 buttonAnchorMax = new Vector2(1, 0);
        private static Vector2 buttonPivot = new Vector2(1, 0);
        private static Vector2 buttonAnchoredPosition = new Vector2(-180, 10);
        private static string buttonParentOverrideName = null;

        // --- Cấu hình Layout MẶC ĐỊNH (Sửa đổi) ---
        private static float defaultContentVerticalOffset = 0f;
        private static float defaultContentHorizontalOffset = 0f;

        // --- Các phương thức cấu hình (Sửa đổi ConfigureLayout) ---

        public static void ConfigureButton(string text = "Cây Mod", string parentName = null,
                                           Vector2? anchorMin = null, Vector2? anchorMax = null,
                                           Vector2? pivot = null, Vector2? anchoredPosition = null)
        { /* ... Giữ nguyên ... */
            buttonText = text; buttonParentOverrideName = parentName;
            if (anchorMin.HasValue) buttonAnchorMin = anchorMin.Value; if (anchorMax.HasValue) buttonAnchorMax = anchorMax.Value;
            if (pivot.HasValue) buttonPivot = pivot.Value; if (anchoredPosition.HasValue) buttonAnchoredPosition = anchoredPosition.Value;
            MelonLogger.Msg($"[GiaoDienTuyChinh] Đã cấu hình nút: Chữ='{buttonText}', Cha='{buttonParentOverrideName ?? "Tự động"}', Vị trí={buttonAnchoredPosition}");
        }


        /// <summary>
        /// (Tùy chọn) Cấu hình layout MẶC ĐỊNH và đăng ký các tên template bổ sung cần tìm sớm.
        /// Gọi từ OnInitializeMelon TRƯỚC KHI RegisterModPlant.
        /// </summary>
        /// <param name="templateObjectName">Tên GameObject dùng làm mẫu MẶC ĐỊNH.</param>
        /// <param name="contentOffsetY">Độ lệch nội dung slot MẶC ĐỊNH theo trục Y.</param>
        /// <param name="contentOffsetX">Độ lệch nội dung slot MẶC ĐỊNH theo trục X.</param>
        /// <param name="additionalTemplates">Danh sách các tên template KHÁC mà các mod sẽ dùng, để tìm chúng sớm trong InitializeUI.</param>
        public static void ConfigureLayout(string templateObjectName = "Blover", float contentOffsetY = 0f, float contentOffsetX = 0f, params string[] additionalTemplates)
        {
            // Cập nhật template mặc định
            defaultPlantTemplateName = string.IsNullOrEmpty(templateObjectName) ? "Blover" : templateObjectName;
            requiredTemplateNames.Add(defaultPlantTemplateName); // Đảm bảo template mặc định luôn trong danh sách cần tìm

            // Cập nhật offset mặc định
            defaultContentVerticalOffset = contentOffsetY;
            defaultContentHorizontalOffset = contentOffsetX;

            // Thêm các template bổ sung vào danh sách cần tìm
            if (additionalTemplates != null)
            {
                foreach (string name in additionalTemplates)
                {
                    if (!string.IsNullOrEmpty(name))
                    {
                        requiredTemplateNames.Add(name);
                    }
                }
            }

            MelonLogger.Msg($"[GiaoDienTuyChinh] Cấu hình layout: Mặc định='{defaultPlantTemplateName}', Offset mặc định=({defaultContentHorizontalOffset},{defaultContentVerticalOffset}). Các template cần tìm: {string.Join(", ", requiredTemplateNames)}");
        }


        /// <summary>
        /// Đăng ký một cây mod. Cho phép chỉ định layout riêng.
        /// Nếu templateObjectName được chỉ định và khác mặc định, hãy đảm bảo nó đã được thêm vào `additionalTemplates` trong `ConfigureLayout`.
        /// </summary>
        /// <param name="templateObjectName">(Tùy chọn) Tên GameObject template dùng riêng. Nếu null, dùng mặc định. Cần được đăng ký trước qua ConfigureLayout nếu khác mặc định.</param>
        public static void RegisterModPlant(int plantId, string plantName, Sprite seedPacketSprite = null,
                                          string templateObjectName = null, float? contentOffsetX = null, float? contentOffsetY = null)
        {
            if (registeredModPlants.Any(p => p.PlantId == plantId)) { MelonLogger.Warning($"[GiaoDienTuyChinh] Plant ID {plantId} ({plantName}) đã được đăng ký trước đó."); return; }

            // Xác định template và offset sẽ sử dụng
            string finalTemplateName = string.IsNullOrEmpty(templateObjectName) ? defaultPlantTemplateName : templateObjectName;
            float finalOffsetX = contentOffsetX.HasValue ? contentOffsetX.Value : defaultContentHorizontalOffset;
            float finalOffsetY = contentOffsetY.HasValue ? contentOffsetY.Value : defaultContentVerticalOffset;

            // Quan trọng: Nếu dùng template không mặc định, thêm vào danh sách cần tìm nếu chưa có
            // Điều này hữu ích nếu ConfigureLayout không được gọi hoặc gọi sau RegisterModPlant
            if (finalTemplateName != defaultPlantTemplateName && !requiredTemplateNames.Contains(finalTemplateName))
            {
                MelonLogger.Warning($"[GiaoDienTuyChinh] Template '{finalTemplateName}' cho cây '{plantName}' chưa được đăng ký trước qua ConfigureLayout. Sẽ cố gắng tìm trong InitializeUI, nhưng nên đăng ký sớm.");
                requiredTemplateNames.Add(finalTemplateName);
            }


            registeredModPlants.Add(new ModPlantInfo
            {
                PlantId = plantId,
                PlantName = plantName,
                SeedPacketSprite = seedPacketSprite,
                TemplateObjectName = finalTemplateName, // Lưu tên template mong muốn
                ContentOffsetX = finalOffsetX,
                ContentOffsetY = finalOffsetY
            });

            MelonLogger.Msg($"[GiaoDienTuyChinh] Đã đăng ký: {plantName} (ID: {plantId}) - Sprite: {seedPacketSprite != null} | Layout: Template='{finalTemplateName}', Offset=({finalOffsetX},{finalOffsetY})");

            // Kích hoạt nút nếu cần (Như cũ)
            if (modPlantsButtonInstance != null && !modPlantsButtonInstance.activeSelf && registeredModPlants.Count > 0)
            {
                modPlantsButtonInstance.SetActive(true);
                MelonLogger.Msg($"[GiaoDienTuyChinh] Đã kích hoạt nút 'Cây Mod'.");
            }
        }

        // --- Logic UI Cốt lõi (Sửa InitializeUI) ---

        /// <summary>
        /// Khởi tạo nút bấm và TÌM SỚM các template cần thiết.
        /// </summary>
        internal static void InitializeUI()
        {
            if (modPlantsButtonInstance != null || Board.Instance == null || InGameUI.Instance == null)
            {
                if (modPlantsButtonInstance != null) { if (!modPlantsButtonInstance.activeSelf && registeredModPlants.Count > 0) { modPlantsButtonInstance.SetActive(true); } }
                //else if (Board.Instance == null) MelonLogger.Error("[GiaoDienTuyChinh Init] Board.Instance là null.");
                //else if (InGameUI.Instance == null) MelonLogger.Error("[GiaoDienTuyChinh Init] InGameUI.Instance là null.");
                return;
            }

            MelonLogger.Msg("[GiaoDienTuyChinh Init] Đang thử khởi tạo UI và tìm templates...");
            foundTemplates.Clear(); // Xóa các template cũ (nếu có từ lần chạy trước)

            try
            {
                // --- TÌM TẤT CẢ TEMPLATE CẦN THIẾT ---
                bool allTemplatesFound = true;
                foreach (string templateName in requiredTemplateNames)
                {
                    // Sử dụng hàm tìm kiếm bao gồm cả đối tượng không active
                    GameObject templateInstance = FindObjectIncludingInactive(templateName);
                    if (templateInstance != null)
                    {
                        foundTemplates[templateName] = templateInstance; // Lưu instance đã tìm thấy
                        MelonLogger.Msg($"[GiaoDienTuyChinh Init] Đã tìm thấy template: '{templateName}'");
                    }
                    else
                    {
                        MelonLogger.Error($"[GiaoDienTuyChinh Init] KHÔNG TÌM THẤY template bắt buộc: '{templateName}'! Slot dùng template này sẽ không được tạo.");
                        allTemplatesFound = false;
                    }
                }

                // Kiểm tra template mặc định có tìm thấy không, vì nó rất quan trọng
                if (!foundTemplates.ContainsKey(defaultPlantTemplateName))
                {
                    throw new System.Exception($"Không tìm thấy template MẶC ĐỊNH '{defaultPlantTemplateName}'. Không thể tiếp tục.");
                }


                // Tìm các Transform cha (Như cũ)
                gridParent = FindGridParent();
                if (gridParent == null) throw new System.Exception("Không tìm thấy Grid Parent.");
                Transform buttonParent = FindButtonParent();
                if (buttonParent == null) throw new System.Exception("Không tìm thấy Button Parent.");

                // Tạo GameObject Nút (Như cũ)
                modPlantsButtonInstance = new GameObject("ModPlantsUIButton");
                modPlantsButtonInstance.transform.SetParent(buttonParent, false);
                modPlantsButtonInstance.transform.localScale = Vector3.one;
                var img = modPlantsButtonInstance.AddComponent<Image>();
                var rect = modPlantsButtonInstance.GetComponent<RectTransform>();
                var btn = modPlantsButtonInstance.AddComponent<Button>();

                // Style Nút (Như cũ)
                GameObject tmplBtn = InGameUI.Instance.StartBattle ?? FindObjectIncludingInactive("Button"); // Thử tìm nút mẫu cả khi inactive
                if (tmplBtn != null) { var ti = tmplBtn.GetComponent<Image>(); var tb = tmplBtn.GetComponent<Button>(); var tr = tmplBtn.GetComponent<RectTransform>(); if (ti != null) { img.sprite = ti.sprite; img.color = ti.color; img.type = ti.type; } else img.color = Color.green; if (tb != null) { btn.transition = tb.transition; btn.colors = tb.colors; btn.spriteState = tb.spriteState; } if (tr != null) rect.sizeDelta = tr.sizeDelta; else rect.sizeDelta = new Vector2(160, 40); } else { img.color = Color.green; rect.sizeDelta = new Vector2(160, 40); MelonLogger.Warning("[GiaoDienTuyChinh Init] Không tìm thấy nút mẫu, sử dụng style mặc định."); }


                // Vị trí Nút (Như cũ)
                rect.anchorMin = buttonAnchorMin; rect.anchorMax = buttonAnchorMax; rect.pivot = buttonPivot; rect.anchoredPosition = buttonAnchoredPosition;

                // Chữ trên Nút (Như cũ)
                var tGO = new GameObject("Text"); tGO.transform.SetParent(modPlantsButtonInstance.transform, false); var t = tGO.AddComponent<TextMeshProUGUI>(); t.text = buttonText; t.alignment = TextAlignmentOptions.Center; t.color = Color.black; t.fontSize = 18; var trT = tGO.GetComponent<RectTransform>(); trT.anchorMin = Vector2.zero; trT.anchorMax = Vector2.one; trT.sizeDelta = Vector2.zero; trT.anchoredPosition = Vector2.zero;

                // Sự kiện onClick Nút (Như cũ)
                btn.onClick.RemoveAllListeners();
                // AddListener của Button.onClick mong đợi một UnityEngine.Events.UnityAction.
                // Il2CppInterop thường xử lý việc chuyển đổi từ System.Action.
                System.Action act = ToggleModPlantView; // Tạo một System.Action delegate trỏ đến hàm ToggleModPlantView
                // Truyền System.Action vào AddListener. Il2CppInterop sẽ xử lý việc chuyển đổi cần thiết.
                btn.onClick.AddListener(act);


                // Thiết lập trạng thái Active của Nút (Như cũ)
                modPlantsButtonInstance.SetActive(registeredModPlants.Count > 0);
                MelonLogger.Msg($"[GiaoDienTuyChinh Init] Đã tạo thành công nút '{buttonText}'. Trạng thái Active: {modPlantsButtonInstance.activeSelf}");

            }
            catch (System.Exception e) { MelonLogger.Error($"[GiaoDienTuyChinh Init] Thất bại: {e.Message}\n{e.StackTrace}"); CleanupInternal(true); }
        }


        // --- Các phương thức trợ giúp ---

        /// <summary>
        /// Lấy đường dẫn đầy đủ của một Transform trong hierarchy để ghi log.
        /// </summary>
        private static string GetFullPath(Transform t)
        { /* ... Giữ nguyên ... */
            if (t == null) return "null"; string path = t.name;
            while (t.parent != null) { t = t.parent; path = t.name + "/" + path; }
            return path;
        }

        /// <summary>
        /// Cố gắng tìm Transform chứa các ô cây trong lưới chọn.
        /// </summary>
        private static Transform FindGridParent()
        { /* ... Giữ nguyên logic tìm kiếm ... */
            Transform p = null;
            if (InGameUI.Instance?.grid != null) { p = InGameUI.Instance.grid.transform; } // Ưu tiên tham chiếu trực tiếp
            else if (InGameUI.Instance?.SeedBank != null) { var c = InGameUI.Instance.SeedBank.transform.Find("Scroll View/Viewport/Content"); p = c ?? InGameUI.Instance.SeedBank.transform.Find("Content") ?? InGameUI.Instance.SeedBank.transform; } // Thử cấu trúc phổ biến của SeedBank
            else
            {
                // Dùng hàm tìm kiếm tốt hơn
                var gridObj = FindObjectIncludingInactive("UI/InGameUI/SeedBank/Scroll View/Viewport/Content") ?? FindObjectIncludingInactive("Grid");
                if (gridObj != null) p = gridObj.transform;
            }

            if (p != null) MelonLogger.Msg($"[GiaoDienTuyChinh] Tìm thấy Grid Parent: {GetFullPath(p)}");
            else MelonLogger.Error("[GiaoDienTuyChinh] Không thể tìm thấy Grid Parent!");
            return p;
        }

        /// <summary>
        /// Cố gắng tìm một Transform phù hợp để làm cha cho nút "Cây Mod".
        /// </summary>
        private static Transform FindButtonParent()
        { /* ... Giữ nguyên logic tìm kiếm ... */
            Transform p = null;
            if (!string.IsNullOrEmpty(buttonParentOverrideName))
            {
                var go = FindObjectIncludingInactive(buttonParentOverrideName); // Tìm cả inactive
                if (go != null) p = go.transform;
                else MelonLogger.Warning($"[GiaoDienTuyChinh] Không tìm thấy Button Parent được chỉ định '{buttonParentOverrideName}'.");
            }
            if (p == null) { var sb = InGameUI.Instance?.StartBattle; if (sb != null && sb.transform.parent != null) p = sb.transform.parent; }
            if (p == null && InGameUI.Instance?.Bottom != null) p = InGameUI.Instance.Bottom.transform;
            if (p == null && gridParent != null && gridParent.parent != null) p = gridParent.parent;
            if (p == null && InGameUI.Instance != null) p = InGameUI.Instance.transform;

            if (p != null) MelonLogger.Msg($"[GiaoDienTuyChinh] Tìm thấy Button Parent: {GetFullPath(p)}");
            else MelonLogger.Error("[GiaoDienTuyChinh] Không thể tìm thấy Button Parent phù hợp!");
            return p;
        }


        /// <summary>
        /// Tìm GameObject theo tên trong toàn bộ scene, bao gồm cả inactive objects.
        /// </summary>
        private static GameObject FindObjectIncludingInactive(string name)
        {
            // UnityEngine.SceneManagement.SceneManager
            for (int i = 0; i < SceneManager.sceneCount; i++)
            {
                Scene scene = SceneManager.GetSceneAt(i);
                if (scene.isLoaded)
                {
                    var rootObjects = scene.GetRootGameObjects();
                    foreach (GameObject rootObject in rootObjects)
                    {
                        // Tìm trong chính root object
                        if (rootObject.name == name)
                        {
                            // MelonLogger.Msg($"FindObjectIncludingInactive: Found '{name}' as root object in scene '{scene.name}'.");
                            return rootObject;
                        }
                        // Tìm trong tất cả con cháu (kể cả inactive)
                        Transform foundChild = FindInChildrenRecursive(rootObject.transform, name);
                        if (foundChild != null)
                        {
                            //MelonLogger.Msg($"FindObjectIncludingInactive: Found '{name}' as child of '{rootObject.name}' in scene '{scene.name}'.");
                            return foundChild.gameObject;
                        }
                    }
                }
            }
            //MelonLogger.Warning($"FindObjectIncludingInactive: Could not find GameObject named '{name}' in any loaded scene.");
            return null; // Không tìm thấy
        }

        /// <summary>
        /// Hàm đệ quy tìm con theo tên.
        /// </summary>
        private static Transform FindInChildrenRecursive(Transform parent, string name)
        {
            // Duyệt qua các con trực tiếp bằng vòng lặp for và GetChild
            int childCount = parent.childCount;
            for (int i = 0; i < childCount; i++)
            {
                // Lấy Transform của con thứ i
                Transform child = parent.GetChild(i);

                // Kiểm tra null phòng trường hợp hi hữu
                if (child == null) continue;

                // Kiểm tra tên con hiện tại
                if (child.name == name)
                {
                    return child; // Tìm thấy!
                }

                // Nếu không phải, tìm tiếp trong con cháu của con này
                Transform found = FindInChildrenRecursive(child, name);
                if (found != null)
                {
                    return found; // Tìm thấy ở tầng sâu hơn
                }
            }
            return null; // Không tìm thấy trong nhánh này
        }


        // --- Logic Chuyển đổi View ---

        /// <summary>
        /// Chuyển đổi qua lại giữa hiển thị cây gốc và cây mod.
        /// </summary>
        private static void ToggleModPlantView()
        {
            // Kiểm tra điều kiện tiên quyết
            // Bỏ kiểm tra plantTemplateInstance, thay bằng kiểm tra foundTemplates có chứa template mặc định không
            if (gridParent == null || !foundTemplates.ContainsKey(defaultPlantTemplateName) || PlantDataLoader.plantData == null || InGameUI.Instance == null)
            {
                MelonLogger.Error($"[GiaoDienTuyChinh Toggle] Thiếu điều kiện! Grid:{gridParent != null}, Template mặc định tìm thấy:{foundTemplates.ContainsKey(defaultPlantTemplateName)}, Data:{PlantDataLoader.plantData != null}, Mgr:{InGameUI.Instance != null}");
                // Có thể thêm log chi tiết hơn về template nào thiếu nếu cần
                if (!foundTemplates.ContainsKey(defaultPlantTemplateName))
                {
                    MelonLogger.Error($"[GiaoDienTuyChinh Toggle] Template mặc định '{defaultPlantTemplateName}' không được tìm thấy trước đó.");
                }
                return;
            }
            if (registeredModPlants.Count == 0 && !isShowingModPlantView)
            {
                MelonLogger.Warning("[GiaoDienTuyChinh Toggle] Không có cây mod nào được đăng ký để hiển thị.");
                return;
            }

            // Đảo trạng thái
            isShowingModPlantView = !isShowingModPlantView;
            MelonLogger.Msg($"--- [GiaoDienTuyChinh Toggle] Đã chuyển sang: {(isShowingModPlantView ? "VIEW CÂY MOD" : "VIEW CÂY GỐC")} ---");

            if (isShowingModPlantView)
            {
                ShowModPlantView(); // Chuyển sang view mod
            }
            else
            {
                DeselectActiveModCards(); // Bỏ chọn các thẻ mod đang active trước
                RestoreOriginalView(); // Chuyển về view gốc
            }
            RebuildLayout(); // Cập nhật lại layout sau khi thay đổi
        }

        /// <summary>
        /// Yêu cầu game bỏ chọn các thẻ cây mod đang nằm trong khay hạt giống.
        /// </summary>
        private static void DeselectActiveModCards()
        { /* ... Giữ nguyên ... */
            System.Collections.Generic.List<int> plantsToDeselect = new System.Collections.Generic.List<int>();
            // Sử dụng List<T> của Il2CppSystem vì cardOnBank là kiểu đó
            var currentBank = InGameUI.Instance?.cardOnBank;
            if (currentBank != null)
            {
                foreach (var kvp in modSlotInteractableCards)
                {
                    if (kvp.Value != null)
                    {
                        // Cần duyệt qua Il2CppSystem.Collections.Generic.List
                        bool found = false;
                        for (int i = 0; i < currentBank.Count; i++)
                        {
                            if (currentBank[i] != null && currentBank[i].GetInstanceID() == kvp.Value.GetInstanceID())
                            {
                                found = true;
                                break;
                            }
                        }

                        if (found)
                        {
                            plantsToDeselect.Add(kvp.Key);
                        }
                    }
                }
            }
            else { MelonLogger.Warning("[GiaoDienTuyChinh Deselect] cardOnBank là null."); }

            int deselectedCount = 0;
            foreach (int plantId in plantsToDeselect)
            {
                if (modSlotInteractableCards.TryGetValue(plantId, out GameObject cardToDeselect))
                {
                    // MelonLogger.Msg($"[Deselect] Yêu cầu game bỏ chọn thẻ của cây ID {plantId} khỏi bank.");
                    try
                    {
                        InGameUI.Instance.RemoveCardFromBank(cardToDeselect);
                        deselectedCount++;
                    }
                    catch (System.Exception ex) { MelonLogger.Error($"[Deselect] Lỗi khi gọi RemoveCardFromBank cho ID {plantId}: {ex}"); }
                }
            }
            if (deselectedCount > 0) MelonLogger.Msg($"[Deselect] Đã gửi yêu cầu bỏ chọn cho {deselectedCount} thẻ mod.");
        }

        /// <summary>
        /// Ẩn các slot cây gốc và hiển thị các slot cây mod.
        /// </summary>
        private static void ShowModPlantView()
        {
            originalSlots.Clear();
            createdModSlots.ForEach(go => { if (go != null) UnityEngine.Object.Destroy(go); }); // Hủy slot cũ trước
            createdModSlots.Clear();
            modSlotInteractableCards.Clear();
            modCardOriginalPositions.Clear();

            MelonLogger.Msg("[GiaoDienTuyChinh ShowModView] Đang ẩn slot gốc và tạo slot mod...");
            System.Collections.Generic.List<GameObject> childrenToHide = new System.Collections.Generic.List<GameObject>();
            if (gridParent != null)
            {
                for (int i = 0; i < gridParent.childCount; i++)
                {
                    var child = gridParent.GetChild(i)?.gameObject;
                    // Kiểm tra kỹ hơn: Chỉ ẩn nếu nó là slot cây (có CardUI) VÀ không phải là slot mod vừa tạo (đề phòng)
                    if (child != null && child.GetComponentInChildren<CardUI>(true) != null && !createdModSlots.Contains(child) /*&& !child.name.StartsWith("ModSlot_")*/)
                    {
                        childrenToHide.Add(child);
                    }
                }
            }
            else { MelonLogger.Error("[GiaoDienTuyChinh ShowModView] gridParent là null khi đang ẩn slot gốc!"); }

            // Lưu tham chiếu và ẩn slot gốc
            foreach (var c in childrenToHide) { originalSlots.Add(c); c.SetActive(false); }
            MelonLogger.Msg($"[GiaoDienTuyChinh ShowModView] Đã lưu và ẩn {originalSlots.Count} slot gốc.");

            // Tạo slot cho các cây mod đã đăng ký
            MelonLogger.Msg($"[GiaoDienTuyChinh ShowModView] Đang tạo {registeredModPlants.Count} slot cây mod...");
            int createdCount = 0;
            foreach (var plantInfo in registeredModPlants)
            {
                // Gọi hàm tạo slot, hàm này sẽ tự lấy thông tin layout từ plantInfo và template từ foundTemplates
                if (CreateAndAddSingleModSlot(plantInfo))
                {
                    createdCount++;
                }
            }
            MelonLogger.Msg($"[GiaoDienTuyChinh ShowModView] Đã tạo xong {createdCount} slot mod thành công.");
        }

        /// <summary>
        /// Hủy các slot cây mod và khôi phục các slot cây gốc.
        /// </summary>
        private static void RestoreOriginalView()
        { /* ... Giữ nguyên ... */
            // Hủy các slot mod và xóa tham chiếu
            createdModSlots.ForEach(go => { if (go != null) UnityEngine.Object.Destroy(go); });
            createdModSlots.Clear();
            modSlotInteractableCards.Clear();
            modCardOriginalPositions.Clear(); // Xóa dữ liệu vị trí gốc
            MelonLogger.Msg("[GiaoDienTuyChinh RestoreView] Đã hủy slot mod và xóa tham chiếu/vị trí thẻ.");

            // Khôi phục các slot gốc
            int restoredCount = 0;
            foreach (var slot in originalSlots)
            {
                if (slot != null)
                {
                    if (slot.transform.parent != gridParent && gridParent != null)
                    {
                        slot.transform.SetParent(gridParent, false);
                        MelonLogger.Warning($"[GiaoDienTuyChinh RestoreView] Slot gốc '{slot.name}' đã được gắn lại vào Grid.");
                    }
                    slot.SetActive(true); restoredCount++;
                }
                else { MelonLogger.Warning("[GiaoDienTuyChinh RestoreView] Một slot gốc đã bị hủy từ bên ngoài."); }
            }
            MelonLogger.Msg($"[GiaoDienTuyChinh RestoreView] Đã khôi phục {restoredCount}/{originalSlots.Count} slot gốc.");
            originalSlots.Clear(); // Xóa danh sách slot gốc đã khôi phục
        }

        // --- Tạo Slot (Sửa đổi) ---

        /// <summary>
        /// Tạo một GameObject slot cây mod. Trả về true nếu thành công.
        /// </summary>
        private static bool CreateAndAddSingleModSlot(ModPlantInfo plantInfo)
        {
            // Lấy template từ Dictionary đã tìm trước đó
            GameObject templateInstance;
            if (!foundTemplates.TryGetValue(plantInfo.TemplateObjectName, out templateInstance))
            {
                // Nếu không tìm thấy template yêu cầu, thử dùng template mặc định
                MelonLogger.Warning($"[Tạo Slot-{plantInfo.PlantName}] Không tìm thấy template '{plantInfo.TemplateObjectName}' trong bộ nhớ đệm. Thử dùng template mặc định '{defaultPlantTemplateName}'.");
                if (!foundTemplates.TryGetValue(defaultPlantTemplateName, out templateInstance))
                {
                    // Nếu cả template mặc định cũng không có -> Bó tay
                    MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Template mặc định '{defaultPlantTemplateName}' cũng không có sẵn. Không thể tạo slot.");
                    return false;
                }
            }

            // Gọi hàm nội bộ để tạo slot, truyền template đã tìm thấy và offset từ plantInfo
            GameObject newSlot = CreateModPlantSlotInternal(gridParent, templateInstance, plantInfo, plantInfo.ContentOffsetX, plantInfo.ContentOffsetY);
            if (newSlot != null)
            {
                newSlot.SetActive(true);
                createdModSlots.Add(newSlot);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Logic nội bộ để tạo GameObject slot cây mod (Gần giống 1.2.4, nhưng dùng offset từ plantInfo).
        /// </summary>
        private static GameObject CreateModPlantSlotInternal(Transform parent, GameObject template, ModPlantInfo plantInfo, float contentOffsetX, float contentOffsetY)
        {
            // Template đã được kiểm tra non-null ở hàm gọi CreateAndAddSingleModSlot
            // if (template == null) { MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Template là null (Lỗi logic!)"); return null; }

            GameObject slotGO = null;
            GameObject contentContainerGO = null;

            try
            {
                // 1. Lấy Sprite (Như cũ - dùng template được truyền vào)
                Sprite seedSprite = plantInfo.SeedPacketSprite;
                if (seedSprite == null)
                {
                    var imgComp = template.transform.GetChild(0)?.GetComponent<Image>() ?? template.transform.GetChild(2)?.GetComponent<Image>();
                    if (imgComp?.sprite != null) { seedSprite = imgComp.sprite; }
                    else { MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Không lấy được sprite từ template '{template.name}'!"); return null; }
                }

                // 2. Lấy Dữ liệu Cây (Như cũ)
                PlantDataLoader.PlantData_ plantDataEntry = PlantDataLoader.plantData?.FirstOrDefault(data => data != null && data.field_Public_PlantType_0 == (PlantType)plantInfo.PlantId);
                if (plantDataEntry == null) { MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Không tìm thấy PlantData ID {plantInfo.PlantId}!"); return null; }

                // 3. Tạo GameObject Slot Chính (Như cũ)
                slotGO = new GameObject($"ModSlot_{plantInfo.PlantName}");
                slotGO.transform.SetParent(parent, false);
                slotGO.transform.localScale = Vector3.one;

                // 4. Thêm LayoutElement vào Slot Chính (Như cũ)
                var layoutElement = slotGO.AddComponent<LayoutElement>();
                var templateLayout = template.GetComponent<LayoutElement>();
                if (templateLayout != null) { layoutElement.preferredWidth = templateLayout.preferredWidth; layoutElement.preferredHeight = templateLayout.preferredHeight; /* copy thêm props nếu cần */ }
                else { layoutElement.preferredWidth = 70f; layoutElement.preferredHeight = 90f; MelonLogger.Warning($"[Tạo Slot-{plantInfo.PlantName}] Template '{template.name}' thiếu LayoutElement."); }


                // 5. Tạo Container Nội dung Trung gian (Như cũ)
                contentContainerGO = new GameObject("ContentContainer");
                contentContainerGO.transform.SetParent(slotGO.transform, false);
                var contentRect = contentContainerGO.AddComponent<RectTransform>();
                contentRect.anchorMin = Vector2.zero; contentRect.anchorMax = Vector2.one;
                contentRect.pivot = new Vector2(0.5f, 0.5f); contentRect.sizeDelta = Vector2.zero;

                // --- SỬ DỤNG OFFSET TỪ PARAMS (đã lấy từ plantInfo ở hàm gọi) ---
                contentRect.anchoredPosition = new Vector2(contentOffsetX, contentOffsetY);


                // 6. Instantiate Nền và Thẻ làm CON CỦA CONTENT CONTAINER (Như cũ)

                // Nền
                Transform bgTemplate = template.transform.GetChild(0);
                if (bgTemplate != null)
                {
                    var bgGO = UnityEngine.Object.Instantiate(bgTemplate.gameObject, contentContainerGO.transform);
                    bgGO.name = $"BG_{plantInfo.PlantName}";
                    Lawnf.ChangeCardSprite((PlantType)plantInfo.PlantId, bgGO); // Tạm comment nếu Lawnf không tồn tại
                    var bgImage = bgGO.GetComponent<Image>(); if (bgImage != null) bgImage.sprite = seedSprite;
                    var costText = bgGO.GetComponentInChildren<TextMeshProUGUI>(true); if (costText != null) costText.text = plantDataEntry.field_Public_Int32_1.ToString();
                    var bgRect = bgGO.GetComponent<RectTransform>(); var templateBgRect = bgTemplate.GetComponent<RectTransform>();
                    if (bgRect != null && templateBgRect != null) { bgRect.anchorMin = templateBgRect.anchorMin; bgRect.anchorMax = templateBgRect.anchorMax; bgRect.pivot = templateBgRect.pivot; bgRect.anchoredPosition = templateBgRect.anchoredPosition; bgRect.sizeDelta = templateBgRect.sizeDelta; bgRect.localScale = templateBgRect.localScale; } // Copy cả scale
                    bgGO.SetActive(true);
                }
                else { MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Template '{template.name}' thiếu con thứ 0 (Background)!"); }


                // Thẻ kéo thả
                Transform cardTemplate = template.transform.GetChild(2);
                if (cardTemplate != null)
                {
                    var cardGO = UnityEngine.Object.Instantiate(cardTemplate.gameObject, contentContainerGO.transform);
                    cardGO.name = $"Card_{plantInfo.PlantName}";
                    Lawnf.ChangeCardSprite((PlantType)plantInfo.PlantId, cardGO); // Tạm comment
                    modSlotInteractableCards[plantInfo.PlantId] = cardGO;

                    var cardImage = cardGO.GetComponent<Image>(); if (cardImage != null) cardImage.sprite = seedSprite;
                    var cardUI = cardGO.GetComponent<CardUI>();
                    var cardRect = cardGO.GetComponent<RectTransform>();
                    var templateCardRect = cardTemplate.GetComponent<RectTransform>();

                    if (cardUI != null && cardRect != null && templateCardRect != null)
                    {
                        cardUI.parent = contentContainerGO; // <<< Vẫn giữ thay đổi quan trọng này
                        cardUI.CD = plantDataEntry.field_Public_Single_2;
                        cardUI.theSeedCost = plantDataEntry.field_Public_Int32_1;
                        cardUI.thePlantType = (PlantType)plantInfo.PlantId;
                        cardUI.theZombieType = (ZombieType)plantInfo.PlantId; // Điều chỉnh nếu cần

                        cardRect.anchorMin = templateCardRect.anchorMin; cardRect.anchorMax = templateCardRect.anchorMax;
                        cardRect.pivot = templateCardRect.pivot; cardRect.anchoredPosition = templateCardRect.anchoredPosition;
                        cardRect.sizeDelta = templateCardRect.sizeDelta;
                        cardRect.localScale = templateCardRect.localScale; // Copy scale
                        cardRect.SetAsLastSibling();

                        modCardOriginalPositions[plantInfo.PlantId] = new CardPositionData
                        {
                            AnchoredPosition = cardRect.anchoredPosition,
                            AnchorMin = cardRect.anchorMin,
                            AnchorMax = cardRect.anchorMax,
                            Pivot = cardRect.pivot,
                            SizeDelta = cardRect.sizeDelta
                        };
                        //MelonLogger.Msg($"[Tạo Slot-{plantInfo.PlantName}] ({template.name}) Đã lưu vị trí thẻ gốc.");
                        cardGO.SetActive(true);
                    }
                    else { throw new System.InvalidOperationException($"Thiếu component CardUI/RectTransform trên thẻ hoặc template '{template.name}'."); }
                }
                else { throw new System.InvalidOperationException($"Template '{template.name}' thiếu con thứ 2 (Card)."); }

                return slotGO;
            }
            catch (System.Exception e)
            {
                MelonLogger.Error($"[Tạo Slot-{plantInfo.PlantName}] Thất bại nghiêm trọng: {e.Message}\n{e.StackTrace}");
                if (slotGO != null) UnityEngine.Object.Destroy(slotGO);
                if (modSlotInteractableCards.ContainsKey(plantInfo.PlantId)) modSlotInteractableCards.Remove(plantInfo.PlantId);
                if (modCardOriginalPositions.ContainsKey(plantInfo.PlantId)) modCardOriginalPositions.Remove(plantInfo.PlantId);
                return null;
            }
        }

        // --- Tiện ích ---

        /// <summary>
        /// Buộc LayoutGroup trên grid parent tính toán lại vị trí các phần tử.
        /// Sửa lỗi thiếu LayoutGroup.
        /// </summary>
        private static void RebuildLayout()
        {
            if (gridParent != null)
            {
                var layoutGroup = gridParent.GetComponent<LayoutGroup>();
                if (layoutGroup != null)
                {
                    // Sử dụng coroutine để đảm bảo layout được cập nhật đúng cách
                    MelonCoroutines.Start(RebuildLayoutCoroutine(layoutGroup));
                }
                else
                {
                    // Lỗi đã được báo cáo: Grid Parent thiếu LayoutGroup.
                    // Có thể Grid Parent tìm được không phải là đối tượng chứa LayoutGroup thực sự?
                    // Thử tìm LayoutGroup ở cha hoặc con của gridParent nếu cần.
                    MelonLogger.Warning($"[GiaoDienTuyChinh Rebuild] Grid Parent '{GetFullPath(gridParent)}' thiếu component LayoutGroup. Layout có thể không được cập nhật.");
                    // Tùy chọn: Thử tìm ở cấp cao hơn hoặc thấp hơn
                    // var parentLayout = gridParent.parent?.GetComponent<LayoutGroup>();
                    // var childLayout = gridParent.GetComponentInChildren<LayoutGroup>();
                    // if(parentLayout != null) { /* ... */ } else if (childLayout != null) { /* ... */ }
                }
            }
            else { MelonLogger.Warning("[GiaoDienTuyChinh Rebuild] gridParent là null."); }
        }

        private static IEnumerator RebuildLayoutCoroutine(LayoutGroup layoutGroup)
        {
            if (layoutGroup == null) yield break;
            layoutGroup.enabled = false;
            yield return null; // Chờ 1 frame
            if (layoutGroup != null)
            { // Kiểm tra lại
                layoutGroup.enabled = true;
                // Có thể cần ForceRebuildLayoutImmediate ở đây nếu bật/tắt không đủ
                LayoutRebuilder.ForceRebuildLayoutImmediate(layoutGroup.GetComponent<RectTransform>());
                //MelonLogger.Msg("[GiaoDienTuyChinh Rebuild] Layout rebuild coroutine complete.");
            }
        }


        /// <summary>
        /// Dọn dẹp các thành phần UI do thư viện tạo ra.
        /// </summary>
        internal static void CleanupInternal(bool isFullExit)
        { /* ... Giữ nguyên logic dọn dẹp từ phiên bản trước ... */
            // Chỉ thực hiện nếu có gì đó để dọn dẹp hoặc là đang thoát hoàn toàn
            if (modPlantsButtonInstance == null && !isShowingModPlantView && !isFullExit && createdModSlots.Count == 0 && originalSlots.Count == 0)
            {
                // MelonLogger.Msg("[GiaoDienTuyChinh Cleanup] Không có gì để dọn dẹp.");
                return;
            }

            MelonLogger.Msg($"[GiaoDienTuyChinh Cleanup] Bắt đầu (Thoát hoàn toàn: {isFullExit})...");

            if (isShowingModPlantView)
            {
                RestoreOriginalView(); // Gọi hàm này trước tiên
                isShowingModPlantView = false;
            }

            if (modPlantsButtonInstance != null)
            {
                if (isFullExit)
                {
                    UnityEngine.Object.Destroy(modPlantsButtonInstance);
                    modPlantsButtonInstance = null;
                    MelonLogger.Msg("[GiaoDienTuyChinh Cleanup] Đã hủy nút bấm.");
                }
                else
                {
                    modPlantsButtonInstance.SetActive(false);
                    // MelonLogger.Msg("[GiaoDienTuyChinh Cleanup] Đã ẩn nút bấm.");
                }
            }

            if (isFullExit)
            {
                originalSlots.Clear(); // Chỉ xóa list, không hủy GO gốc

                // Đảm bảo slot mod đã hủy (RestoreOriginalView đã làm)
                if (createdModSlots.Count > 0)
                {
                    MelonLogger.Warning($"[GiaoDienTuyChinh Cleanup] Vẫn còn {createdModSlots.Count} slot mod. Hủy lại...");
                    createdModSlots.ForEach(go => { if (go != null) UnityEngine.Object.Destroy(go); });
                    createdModSlots.Clear();
                }

                modSlotInteractableCards.Clear();
                modCardOriginalPositions.Clear();
                foundTemplates.Clear(); // Xóa cache template
                requiredTemplateNames.Clear(); requiredTemplateNames.Add(defaultPlantTemplateName); // Reset danh sách template cần tìm

                gridParent = null;

                MelonLogger.Msg("[GiaoDienTuyChinh Cleanup] Đã xóa tất cả tham chiếu UI động và cache template.");
            }
            //MelonLogger.Msg("[GiaoDienTuyChinh Cleanup] Hoàn tất.");
        }


        // =======================================================
        //                  CÁC PATCH HARMONY (Nội bộ - Giữ nguyên)
        // =======================================================
        internal static class HarmonyPatches
        {
            [HarmonyPatch(typeof(InitBoard), nameof(InitBoard.RightMoveCamera))]
            internal static class InitPatch
            { /* ... Giữ nguyên ... */
                static void Postfix()
                {
                    //MelonLogger.Msg($"[Harmony] {nameof(InitBoard.RightMoveCamera)} Postfix -> InitializeUI");
                    try { ModPlantUISystem.InitializeUI(); } catch (System.Exception e) { MelonLogger.Error($"Lỗi trong patch InitializeUI: {e}"); }
                }
            }

            [HarmonyPatch(typeof(InitBoard), nameof(InitBoard.ReadySetPlant))]
            internal static class CleanupOnStartPatch
            { /* ... Giữ nguyên ... */
                static void Prefix()
                {
                    // MelonLogger.Msg($"[Harmony] {nameof(InitBoard.ReadySetPlant)} Prefix -> CleanupInternal(false)");
                    try { ModPlantUISystem.CleanupInternal(isFullExit: false); } catch (System.Exception e) { MelonLogger.Error($"Lỗi trong patch CleanupInternal(false): {e}"); }
                }
            }

            [HarmonyPatch(typeof(InitBoard), nameof(InitBoard.RemoveUI))]
            internal static class CleanupOnExitPatch
            { /* ... Giữ nguyên ... */
                static void Prefix()
                {
                    // MelonLogger.Msg($"[Harmony] {nameof(InitBoard.RemoveUI)} Prefix -> CleanupInternal(true)");
                    try { ModPlantUISystem.CleanupInternal(isFullExit: true); } catch (System.Exception e) { MelonLogger.Error($"Lỗi trong patch CleanupInternal(true): {e}"); }
                }
            }

            [HarmonyPatch(typeof(InGameUI), nameof(InGameUI.RemoveCardFromBank))]
            internal static class RemoveCardFromBank_Patch
            { /* ... Giữ nguyên ... */
                static void Postfix(InGameUI __instance, GameObject card)
                {
                    if (card == null) return;

                    try
                    {
                        var cardUI = card.GetComponent<CardUI>();
                        if (cardUI == null) return;

                        int plantId = (int)cardUI.thePlantType;

                        if (modSlotInteractableCards.TryGetValue(plantId, out GameObject managedCard) &&
                            modCardOriginalPositions.TryGetValue(plantId, out CardPositionData originalData))
                        {
                            if (managedCard != null && managedCard.GetInstanceID() == card.GetInstanceID())
                            {
                                Transform contentContainer = cardUI.parent?.transform;

                                if (contentContainer != null && contentContainer.name == "ContentContainer")
                                {
                                    //MelonLogger.Msg($"[Patch Bỏ Chọn] Sửa vị trí cho ID {plantId} ({cardItem.name})");
                                    if (card.transform.parent != contentContainer)
                                    {
                                        card.transform.SetParent(contentContainer, false);
                                    }

                                    var cardRect = card.GetComponent<RectTransform>();
                                    cardRect.anchorMin = originalData.AnchorMin;
                                    cardRect.anchorMax = originalData.AnchorMax;
                                    cardRect.pivot = originalData.Pivot;
                                    cardRect.sizeDelta = originalData.SizeDelta;
                                    cardRect.anchoredPosition = originalData.AnchoredPosition;
                                    cardRect.localScale = Vector3.one;
                                    cardRect.localRotation = Quaternion.identity;

                                    cardRect.SetAsLastSibling();
                                    card.SetActive(true);
                                    //MelonLogger.Msg($"[Patch Bỏ Chọn] ID {plantId} - Khôi phục vị trí.");
                                }
                                else
                                {
                                    string currentParentPath = GetFullPath(card.transform.parent);
                                    string expectedParentName = cardUI.parent?.name ?? "null (cardUI.parent)";
                                    MelonLogger.Warning($"[Patch Bỏ Chọn] ID {plantId}: Parent hiện tại ('{currentParentPath}') không phải ContentContainer ('{expectedParentName}').");
                                }
                            }
                        }
                    }
                    catch (System.Exception e)
                    {
                        string cardName = card?.name ?? "null";
                        MelonLogger.Error($"[Patch Bỏ Chọn] Lỗi postfix cho {cardName}: {e}");
                    }
                }
            }
        } // Kết thúc HarmonyPatches

    } // Kết thúc class ModPlantUISystem
} // Kết thúc namespace GiaoDienTuyChinh