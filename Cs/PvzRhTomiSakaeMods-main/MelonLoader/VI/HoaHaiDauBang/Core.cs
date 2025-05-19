using CayTuyChinh;
using HarmonyLib;
using Il2Cpp;
using Il2CppInterop.Runtime.Injection;
using MelonLoader;
using UnityEngine;
using System;
using GiaoDienTuyChinh;

[assembly: MelonInfo(typeof(HoaHaiDauBang.Core), "PvzRhTomiSakaeMods v1.0 - HoaHaiDauBang", "1.0.0", "TomiSakae", null)]
[assembly: MelonGame("LanPiaoPiao", "PlantsVsZombiesRH")]
[assembly: MelonPlatformDomain(MelonPlatformDomainAttribute.CompatibleDomains.IL2CPP)]

namespace HoaHaiDauBang
{
    [RegisterTypeInIl2Cpp] // Thuộc tính này cần thiết cho MelonLoader/Il2Cpp
    public class LopHoaHaiDauBang : MonoBehaviour
    {
        public Producer plant
        {
            get
            {
                return base.gameObject.GetComponent<Producer>();
            }
        }
    }
    public class Core : MelonMod
    {
        public const int HoaHaiDauBangPlantId = 2034;
        public static float lastActivatedTime = 0f;
        public static int lastActivatedRow = -1;
        public static int secondActivatedRow = -1;
        public static int thirdActivatedRow = -1; // Thêm biến để lưu lại hàng thứ ba
        private static bool isRecursiveCall = false; // Biến tĩnh để theo dõi việc gọi lại

        public override void OnInitializeMelon()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            var ab = CustomCore.GetAssetBundle(MelonAssembly.Assembly, "hoahaidaubang");
            CustomCore.RegisterCustomPlant<Producer, LopHoaHaiDauBang>(HoaHaiDauBangPlantId, ab.GetAsset<GameObject>("TwinFlowerPrefab"),
                ab.GetAsset<GameObject>("TwinFlowerPreview"), [(2032, 2032), (2032, 2032)], 0f, 15f, 0, 300, 15f, 400);

            string plantName = "Hướng Dương Hai Đầu Băng"; // Tên hiển thị
            string plantDescription =
                "Tạo ra hai mặt trời mỗi lần sản xuất và đóng băng zombie trên nhiều hàng.\n" + // Dòng tagline
                "Sản lượng nắng: <color=blue>50 ánh nắng/15 giây</color>\n" + // Dòng sản lượng (dùng màu đỏ)
                "Công thức: <color=blue>Hướng Dương Băng + Hướng Dương Băng</color>\n\n" + // Dòng công thức (dùng màu đỏ) - Thêm \n\n để có dòng trống
                "Hướng Dương Hai Đầu Băng sản xuất gấp đôi ánh nắng và đóng băng zombie trên hàng hiện tại và các hàng lân cận. Có 30% cơ hội đóng băng zombie trên cả 3 hàng cùng lúc, tạo ra vùng kiểm soát rộng lớn để làm chậm nhiều zombie trong 10 giây."; // Phần mô tả lore

            CustomCore.AddPlantAlmanacStrings(HoaHaiDauBangPlantId, plantName, plantDescription);
        }

        // --- PATCH MỚI: ĐÓNG BĂNG ZOMBIE KHI DUAL ICESUNFLOWER TẠO SUN ---
        [HarmonyPatch(typeof(Producer), "ProduceSun")] // Patch vào cùng hàm
        public static class IceSunflower_ProduceSun_FreezeZombies_Patch
        {
            // Postfix chạy SAU khi ProduceSun gốc hoàn thành
            public static void Postfix(Producer __instance)
            {
                // Bước 1: Kiểm tra xem có phải là DualIceSunflower không
                if (__instance != null && __instance.thePlantType == (PlantType)HoaHaiDauBangPlantId)
                {
                    // Bước 2: Đảm bảo Board tồn tại
                    if (Board.Instance == null)
                    {
                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualIceSunflower Patch: Board.Instance là null, không thể đóng băng zombie.");
                        return;
                    }

                    // Bước 3: Lấy dòng của cây
                    int plantRow = __instance.thePlantRow;
                    int totalRows = Board.Instance.rowNum;

                    // Lưu lại hàng đã kích hoạt và thời gian
                    lastActivatedRow = plantRow;
                    lastActivatedTime = Time.time;

                    // Bước 4: Tạo thêm một mặt trời
                    try
                    {
                        // Gọi lại phương thức ProduceSun của Producer để tạo mặt trời thứ hai
                        // Lưu ý: Điều này có thể gây ra đệ quy vô hạn nếu không xử lý cẩn thận
                        // Chúng ta cần đảm bảo rằng chỉ gọi lại ProduceSun một lần
                        if (!isRecursiveCall)
                        {
                            isRecursiveCall = true;
                            __instance.ProduceSun(); // Gọi lại phương thức ProduceSun
                            isRecursiveCall = false;
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualIceSunflower Patch: Lỗi khi tạo thêm mặt trời: {0}\n{1}", ex.Message, ex.StackTrace);
                    }

                    // Bước 5: Đóng băng zombie trên hai hàng
                    try
                    {
                        int zombiesCount = 0;
                        int secondRow = -1;
                        int thirdRow = -1;
                        
                        // Tỉ lệ 30% đóng băng zombie trên cả 3 hàng (nếu có thể)
                        bool freezeThreeRows = UnityEngine.Random.value <= 0.3f;
                        
                        if (freezeThreeRows && plantRow > 0 && plantRow < totalRows - 1)
                        {
                            // Đóng băng zombie trên cả 3 hàng
                            secondRow = plantRow - 1;
                            thirdRow = plantRow + 1;
                            secondActivatedRow = secondRow; // Lưu lại hàng thứ hai đã chọn
                            thirdActivatedRow = thirdRow; // Lưu lại hàng thứ ba đã chọn
                            
                            // Lặp qua tất cả zombie trong zombieArray
                            foreach (Zombie zombie in Board.Instance.zombieArray)
                            {
                                if (zombie == null) continue;
                                
                                // Xử lý zombie trên cả 3 hàng
                                if (zombie.theZombieRow == plantRow || zombie.theZombieRow == secondRow || zombie.theZombieRow == thirdRow)
                                {
                                    // Đóng băng zombie
                                    zombiesCount++;
                                    
                                    // Đóng băng zombie trong 10 giây (tăng thời gian đóng băng)
                                    zombie.SetFreeze(10f);
                                    
                                    // Tạo hiệu ứng băng tại vị trí zombie
                                    try
                                    {
                                        Vector3 zombiePos = zombie.transform.position;
                                        Board.Instance.CreateFreeze(zombiePos);
                                    }
                                    catch (Exception ex)
                                    {
                                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualIceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                    }
                                }
                            }
                        }
                        else
                        {
                            // Ngẫu nhiên chọn hàng trên hoặc hàng dưới
                            bool useUpperRow = UnityEngine.Random.value > 0.5f;

                            if (useUpperRow && plantRow > 0)
                            {
                                secondRow = plantRow - 1;
                            }
                            else if (!useUpperRow && plantRow < totalRows - 1)
                            {
                                secondRow = plantRow + 1;
                            }
                            else
                            {
                                // Nếu không thể chọn hàng theo ý muốn, chọn hàng khả dụng
                                if (plantRow > 0)
                                {
                                    secondRow = plantRow - 1;
                                }
                                else if (plantRow < totalRows - 1)
                                {
                                    secondRow = plantRow + 1;
                                }
                            }

                            secondActivatedRow = secondRow; // Lưu lại hàng thứ hai đã chọn

                            // Lặp qua tất cả zombie trong zombieArray
                            foreach (Zombie zombie in Board.Instance.zombieArray)
                            {
                                if (zombie == null) continue;

                                // Xử lý zombie trên hàng hiện tại
                                if (zombie.theZombieRow == plantRow || zombie.theZombieRow == secondRow)
                                {
                                    // Đóng băng zombie trên cùng hàng với cây hoặc hàng thứ hai
                                    zombiesCount++;

                                    // Đóng băng zombie trong 10 giây (tăng thời gian đóng băng)
                                    zombie.SetFreeze(10f);

                                    // Tạo hiệu ứng băng tại vị trí zombie
                                    try
                                    {
                                        Vector3 zombiePos = zombie.transform.position;
                                        Board.Instance.CreateFreeze(zombiePos);
                                    }
                                    catch (Exception ex)
                                    {
                                        MelonLogger.Warning("[PvzRhTomiSakaeMods] DualIceSunflower: Không thể tạo hiệu ứng băng: {0}", ex.Message);
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        MelonLogger.Error("[PvzRhTomiSakaeMods] DualIceSunflower Patch: Lỗi khi đóng băng zombie: {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
        }

        // --- PATCH MỚI: CHẶN HIỆU ỨNG ĐÓNG BĂNG CHO ZOMBIE Ở HÀNG KHÁC ---
        [HarmonyPatch(typeof(Zombie), "SetFreeze")]
        public static class Zombie_SetFreeze_Patch
        {
            // Prefix chạy TRƯỚC khi SetFreeze gốc chạy
            // Trả về false để ngăn phương thức gốc chạy
            public static bool Prefix(Zombie __instance, float time)
            {
                // Nếu không phải do Hoa Băng gọi (thời gian > 0.1s), cho phép chạy bình thường
                if (Time.time - lastActivatedTime > 0.1f)
                {
                    return true; // Cho phép phương thức gốc chạy
                }

                // Nếu là do Hoa Băng gọi, chỉ cho phép đóng băng zombie trên các hàng đã chọn
                int zombieRow = __instance.theZombieRow;
                int plantRow = lastActivatedRow;

                // Cho phép đóng băng zombie trên cùng hàng với cây
                if (zombieRow == plantRow)
                {
                    return true;
                }

                // Cho phép đóng băng zombie trên hàng thứ hai đã chọn
                if (zombieRow == secondActivatedRow)
                {
                    return true;
                }

                // Cho phép đóng băng zombie trên hàng thứ ba đã chọn (nếu có)
                if (zombieRow == thirdActivatedRow)
                {
                    return true;
                }

                // Không cho phép đóng băng zombie ở các hàng khác
                return false;
            }
        }
    }
}
